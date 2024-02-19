package com.ssafy.archiview.service.user;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.archiview.dto.user.UserDto;
import com.ssafy.archiview.entity.RefreshToken;
import com.ssafy.archiview.entity.Role;
import com.ssafy.archiview.entity.User;
import com.ssafy.archiview.jwt.jwtUtil;
import com.ssafy.archiview.repository.RefreshTokenRepository;
import com.ssafy.archiview.repository.UserRepository;
import com.ssafy.archiview.response.code.ErrorCode;
import com.ssafy.archiview.response.exception.RestApiException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{
    private final UserRepository repository;
    private final RefreshTokenRepository tokenRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final jwtUtil jwtUtil;

    @Override
    public void userAdd(UserDto.AddRequestDto requestDto, HttpServletRequest request) {
        String userEmail = jwtUtil.getUserEmail(request);
        if(!userEmail.equals(requestDto.getEmail())){
            throw new RestApiException(ErrorCode.UNSUPPORTED_TOKEN);
        }
        repository.findById(requestDto.getId()).ifPresent(user -> {
            throw new RestApiException(ErrorCode.DUPLICATED_USER);
        });
        // 패스워드 암호화
        requestDto.setPw(bCryptPasswordEncoder.encode(requestDto.getPw()));
        repository.save(requestDto.toEntity());
    }

    @Override
    public void userLogout(HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);
        RefreshToken token = tokenRepository.getById(userId);
        tokenRepository.delete(token);
//        User user = repository.getById(userId);
//        user.updateRefreshToken(null);  // refreshToken 삭제
//        repository.save(user);
    }

    @Override
    @Transactional
    public void userDelete(HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);  // 엑세스 토큰에서 userId 추출
        User user = repository.getById(userId);  // 추출된 userId로 DB 조회
        repository.delete(user);
    }

    public UserDto.DetailResponseDto userDetail(String userid) {
        return repository.getById(userid).toDetailResponseDto();
    }

    @Override
    public List<UserDto.DetailResponseDto> userDetailList() {
        return repository.findAll().stream()
                .map(User::toDetailResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public void validPassword(String userId, String userPw) {
        String password = repository.getById(userId).getPw();
        if(!bCryptPasswordEncoder.matches(userPw, password)){  // 패스워드가 일치하지 않으면 에러
            throw new RestApiException(ErrorCode.INVALID_PASSWORD);
        }
    }

    @Override
    @Transactional
    public void updatePassword(String userInfo, String userPw) {
        User user = repository.findById(userInfo).orElseGet(() ->
                repository.findByEmail(userInfo).orElseThrow(
                        () -> new RestApiException(ErrorCode.USER_NOT_FOUND)));

        if (bCryptPasswordEncoder.matches(userPw, user.getPw())){  // 기존 패스워드와 같은 패스워드로 변경시 에러 발생 시켜야 함
            throw new RestApiException(ErrorCode.DUPLICATED_PASSWORD);
        }

        user.updatePassword(bCryptPasswordEncoder.encode(userPw));
    }

    @Override
    public User findId(String name, String email) {
        return repository.findByNameAndEmail(name, email)
                .orElseThrow(()-> new RestApiException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    public User findPassword(String userId, String email) {
        return repository.findByIdAndEmail(userId, email)
                .orElseThrow(()-> new RestApiException(ErrorCode.USER_NOT_FOUND));
    }

    @Override
    @Transactional
    public void updateUserDetail(String profileUrl, String introduce, String id) {
        User user = repository.getById(id);
        user.updateUserDetail(profileUrl, introduce);
    }

    @Override
    @Transactional
    public void userUpgrade(String userId) {
        User user = repository.getById(userId);
        if(user.getRole().equals(Role.ROLE_MEMBER) || !user.isAuth()) {
            throw new RestApiException(ErrorCode.UPDATE_NOT_ALLOWED);
        }
        user.updateUserRole(Role.ROLE_MEMBER);
        user.updateUserAuth(false);
    }

    @Override
    @Transactional
    public void userDowngrade(String userId) {
        User user = repository.getById(userId);
        if(user.getRole().equals(Role.ROLE_USER)){
            throw new RestApiException(ErrorCode.UPDATE_NOT_ALLOWED);
        }
        user.updateUserRole(Role.ROLE_USER);
    }

    @Override
    @Transactional
    public void userBlock(String userId) {
        User user = repository.getById(userId);
        if(!user.getRole().equals(Role.ROLE_BLOCK)) {
            user.updateUserRole(Role.ROLE_BLOCK);
        }
        else{
            throw new RestApiException(ErrorCode.BLOCK_NOT_ALLOWED);
        }
        user.updateUserAuth(false);
    }

    @Override
    @Transactional
    public void userApplyUpgrade(String userId) {
        User user = repository.getById(userId);
        if(!user.getRole().equals(Role.ROLE_USER) || user.isAuth()) {
            throw new RestApiException(ErrorCode.UPGRADE_NOT_ACCEPTED);
        }
        user.updateUserAuth(true);
    }
}

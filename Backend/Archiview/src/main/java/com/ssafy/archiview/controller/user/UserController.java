package com.ssafy.archiview.controller.user;

import com.ssafy.archiview.dto.token.EmailTokenDto;
import com.ssafy.archiview.dto.user.UserDto;
import com.ssafy.archiview.entity.User;
import com.ssafy.archiview.jwt.jwtUtil;
import com.ssafy.archiview.response.code.SuccessCode;
import com.ssafy.archiview.response.structure.SuccessResponse;
import com.ssafy.archiview.service.user.MailService;
import com.ssafy.archiview.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    private final MailService mailService;
    private final jwtUtil jwtUtil;

    @PostMapping  // 회원가입
    public ResponseEntity<Object> userAdd(@RequestBody @Valid UserDto.AddRequestDto requestDto, HttpServletRequest request) {
        service.userAdd(requestDto, request);
        return SuccessResponse.createSuccess(SuccessCode.JOIN_SUCCESS);
    }
    @GetMapping("/logout")  // 로그아웃
    public ResponseEntity<Object> userLogout(HttpServletRequest request){
        service.userLogout(request);
        return SuccessResponse.createSuccess(SuccessCode.LOGOUT_SUCCESS);
    }

    @GetMapping  // 회원상세조회
    public ResponseEntity<Object> userDetail(HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);
        UserDto.DetailResponseDto responseDto = service.userDetail(userId);
        return SuccessResponse.createSuccess(SuccessCode.USER_DETAIL_SUCCESS, responseDto);
    }

    @DeleteMapping  // 회원탈퇴
    public ResponseEntity<Object> deleteUser(HttpServletRequest request){
        service.userDelete(request);
        return SuccessResponse.createSuccess(SuccessCode.DELETE_USER_SUCCESS);
    }

    @GetMapping("/find-id")  // 아이디 찾기
    public ResponseEntity<Object> findId(@RequestParam String name, HttpServletRequest request){
        String email = jwtUtil.getUserEmail(request);
        User user = service.findId(name, email);
        return SuccessResponse.createSuccess(SuccessCode.FIND_ID_SUCCESS, user.getId());
    }

    @GetMapping("/find-password")  // 패스워드 찾기
    public ResponseEntity<Object> findPassword(@RequestParam String id, @RequestParam String email){
        service.findPassword(id, email);
        return SuccessResponse.createSuccess(SuccessCode.FIND_PASSWORD_SUCCESS);
    }

    @PostMapping("/valid-password")  // 패스워드 확인
    public ResponseEntity<Object> validPassword(@RequestBody UserDto.passwordDto dto, HttpServletRequest request){
        String userId = jwtUtil.getUsername(request);
        service.validPassword(userId, dto.getPw());
        return SuccessResponse.createSuccess(SuccessCode.PASSWORD_SUCCESS);
    }


    @PatchMapping("/update-password")  // 패스워드 변경
    public ResponseEntity<Object> updatePassword(@RequestBody UserDto.passwordDto dto, HttpServletRequest request){
        String userInfo;
        if(jwtUtil.checkClaims(request.getHeader("Authorization"))){
            userInfo = jwtUtil.getUsername(request);
        }else{
            userInfo = jwtUtil.getUserEmail(request);
        }
        service.updatePassword(userInfo, dto.getPw());
        return SuccessResponse.createSuccess(SuccessCode.PASSWORD_UPDATE_SUCCESS);
    }

    @PatchMapping  // 프로필, 자기소개 변경
    public ResponseEntity<Object> updateUserDetail(@RequestBody UserDto.userDetailDto dto, HttpServletRequest request){
        String userId = jwtUtil.getUsername(request);
        service.updateUserDetail(dto.getProfileUrl(), dto.getIntroduce(), userId);
        return SuccessResponse.createSuccess(SuccessCode.PROFILE_UPDATE_SUCCESS);
    }

    @GetMapping("/join-email")  // 회원가입용 이메일 인증 요청
    public ResponseEntity<Object> mailSend(@RequestParam("email") String email){
        int auth_number = mailService.joinSendMail(email);
        EmailTokenDto.findEmailResponseDto dto = jwtUtil.createEmailToken(email, auth_number);
        return SuccessResponse.createSuccess(SuccessCode.EMAIL_SUCCESS, dto);
    }


    @GetMapping("/find-email")  // 아이디, 패스워드 찾기용 이메일 인증 요청
    public ResponseEntity<Object> findMailSend(@RequestParam("email") String email) {
        int auth_number = mailService.findSendMail(email);
        EmailTokenDto.findEmailResponseDto dto = jwtUtil.createEmailToken(email, auth_number);
        return SuccessResponse.createSuccess(SuccessCode.EMAIL_SUCCESS, dto);
    }

    @PreAuthorize("hasRole('USER')")
    @PatchMapping("/upgrade")  // 등업 신청
    public ResponseEntity<Object> applyUserUpgrade(HttpServletRequest request){
        String userId = jwtUtil.getUsername(request);
        service.userApplyUpgrade(userId);
        return SuccessResponse.createSuccess(SuccessCode.USER_APPLY_UPGRADE_SUCCESS);
    }
}


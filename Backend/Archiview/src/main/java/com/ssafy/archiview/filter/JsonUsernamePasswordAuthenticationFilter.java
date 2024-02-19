package com.ssafy.archiview.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.archiview.dto.token.TokenDto;
import com.ssafy.archiview.dto.user.CustomUserDetails;
import com.ssafy.archiview.dto.user.UserDto;
import com.ssafy.archiview.entity.RefreshToken;
import com.ssafy.archiview.repository.RefreshTokenRepository;
import com.ssafy.archiview.entity.User;
import com.ssafy.archiview.jwt.jwtUtil;
import com.ssafy.archiview.repository.UserRepository;
import com.ssafy.archiview.response.code.ErrorCode;
import com.ssafy.archiview.response.code.SuccessCode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

public class JsonUsernamePasswordAuthenticationFilter extends AbstractAuthenticationProcessingFilter {
    private final jwtUtil jwtUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;
    private static final String DEFAULT_LOGIN_REQUEST_URL = "/api/users/login";  // /api/users/login으로 오는 요청을 처리
    private static final String HTTP_METHOD = "POST";    //HTTP 메서드의 방식은 POST
    private static final String CONTENT_TYPE = "application/json";//json 타입의 데이터로만 로그인을 진행
    private static final AntPathRequestMatcher DEFAULT_LOGIN_PATH_REQUEST_MATCHER =
            new AntPathRequestMatcher(DEFAULT_LOGIN_REQUEST_URL, HTTP_METHOD); //=>   /login의 요청에, POST로 온 요청에 매칭된다.

    private final ObjectMapper objectMapper;
    @Autowired
    public JsonUsernamePasswordAuthenticationFilter(ObjectMapper objectMapper, jwtUtil jwtUtil /* ,
                                                    AuthenticationSuccessHandler authenticationSuccessHandler, // 로그인 성공 시 처리할 핸들러
                                                    AuthenticationFailureHandler authenticationFailureHandler // 로그인 실패 시 처리할 핸들러 */
    ) {

        super(DEFAULT_LOGIN_PATH_REQUEST_MATCHER);   // 위에서 설정한 /api/users/login의 요청에, GET으로 온 요청을 처리하기 위해 설정한다.
        this.objectMapper = objectMapper;
        this.jwtUtil = jwtUtil;
//        setAuthenticationFailureHandler(authenticationFailureHandler);
//        setAuthenticationSuccessHandler(authenticationSuccessHandler);
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException {
        // 1. username, password를 받아서
        // 2. 정상인지 로그인을 시도해본다. authenticationManager로 로그인을 시도하면
        // PrincipalDetailsService의 loadUserByUsername()가 실행됨
        // 3. PrincipalDetails를 세션에 담고 (권한 관리를 위해서)
        // 4. JWT토큰을 만들어서 응답
        System.out.println("로그인 필터입니다.");
        if (request.getContentType() == null || !request.getContentType().equals(CONTENT_TYPE)) {  // Json 요청이 아니면 에러 발생
            throw new AuthenticationServiceException("Authentication Content-Type not supported: " + request.getContentType());
        }
        // json 형태로 데이터를 받음
        LoginDto loginDto = objectMapper.readValue(StreamUtils.copyToString(request.getInputStream(), StandardCharsets.UTF_8), LoginDto.class);

        String id = loginDto.getId();
        String pw = loginDto.getPw();
        if (id == null || pw == null) {
            throw new AuthenticationServiceException("DATA IS MISS");
        }
        // ID, PW를 기반으로 Authentication 객체 생성
        UsernamePasswordAuthenticationToken authRequest = new UsernamePasswordAuthenticationToken(id, pw);

        // 실제 검증 (사용자 비밀번호 체크)
        // authenticate 매서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드가 실행
        Authentication authentication = getAuthenticationManager().authenticate(authRequest);

        SecurityContextHolder.getContext().setAuthentication(authentication);
        setDetails(request, authRequest);
        return authentication;
    }

    protected void setDetails(HttpServletRequest request, UsernamePasswordAuthenticationToken authRequest) {
        authRequest.setDetails(this.authenticationDetailsSource.buildDetails(request));
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authentication) throws IOException {
        System.out.println("login success");
        // 유저 권한 추출
        String authoritie = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        //UserDetails
        CustomUserDetails customUserDetails = (CustomUserDetails) authentication.getPrincipal();

        String userId = customUserDetails.getUsername();  // userId 추출
        User user = userRepository.findById(userId).get();
        TokenDto.createTokenDto token = jwtUtil.createJwt(userId, user.getRole().toString());  // 토큰 생성

        UserDto.loginResponseDto responseDto = UserDto.loginResponseDto.builder()
                .accessToken(token.getAccessToken())
                .refreshToken(token.getRefreshToken())
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profileUrl(user.getProfileUrl())
                .introduce((user.getIntroduce()))
                .role(user.getRole())
                .isAuth(user.isAuth())
                .build();

        RefreshToken refreshToken = RefreshToken.builder()
                .id(user.getId())
                .refreshToken(token.getRefreshToken())
                .build();
        refreshTokenRepository.save(refreshToken);  // 발급받은 refreshToken을 redis에 저장

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("code", SuccessCode.LOGIN_SUCCESS.name());
        map.put("message", SuccessCode.LOGIN_SUCCESS.getMessage());
        map.put("data", responseDto);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.OK.value());
        response.getWriter().write(new ObjectMapper().writeValueAsString(map));
    }

    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) {
        ErrorCode errorCode = ErrorCode.UNAUTHORIZED_REQUEST;
        ObjectMapper objectMapper = new ObjectMapper();
        response.setStatus(errorCode.getHttpStatus().value());  // 401
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ErrorResponse errorResponse = new ErrorResponse(errorCode.name(), errorCode.getMessage());
        try{
            response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    @Data
    private static class LoginDto {
        private final String id;  // request key (username -> id)
        private final String pw;  // request key (password -> pw)
    }

    @Data
    public static class ErrorResponse{
        private final String code;
        private final String message;
    }
}
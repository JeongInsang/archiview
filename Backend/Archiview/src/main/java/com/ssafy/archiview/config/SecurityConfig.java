package com.ssafy.archiview.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.archiview.filter.JwtAccessDeniedHandler;
import com.ssafy.archiview.filter.JwtExceptionHandlerFilter;
import com.ssafy.archiview.jwt.*;
import com.ssafy.archiview.filter.JsonUsernamePasswordAuthenticationFilter;
import com.ssafy.archiview.filter.JwtAuthFilter;
import com.ssafy.archiview.service.user.CustomUserDetailsService;
import jakarta.servlet.Filter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {
    //AuthenticationManager가 인자로 받을 AuthenticationConfiguraion 객체 생성자 주입
    private final AuthenticationConfiguration authenticationConfiguration;
    private final CustomUserDetailsService customUserDetailsService;
    private final jwtUtil jwtUtil;

    private final ObjectMapper objectMapper;
    private final UserDetailsService loginService;
    private LoginSuccessHandler loginSuccessHandler;
    private LoginFailureHandler loginFailureHandler;

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf((auth) -> auth.disable())  // 토큰 방식이므로 csrf 설정 해제
                .formLogin((auth) -> auth.disable())  // jwt 로그인 사용하기 때문에 From 로그인 방식 disable
                .httpBasic((auth) -> auth.disable())  // http basic 인증 방식 disable
                .sessionManagement((session) -> session   // JWT 사용 위해 기존의 세션 방식 인증 해제
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // URL Mapping
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // ADMIN 접근 가능
                        .requestMatchers("/api/users/**").permitAll()
//                        .requestMatchers("/api/users").permitAll()
                        .requestMatchers("/api/token/**").permitAll()
                        .requestMatchers("/api/replies/**").permitAll()  // 답변
                        .requestMatchers("/api/recruits/**").permitAll() //  채용공고
                        .requestMatchers("/api/questions/**").permitAll() //  질문
                        .requestMatchers("/api/commons/**").permitAll()
                        .anyRequest().authenticated())  // 나머지 요청은 모두 인증 되어야 함.

                .addFilterBefore(jsonUsernamePasswordAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JwtAuthFilter(customUserDetailsService, jwtUtil), JsonUsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(new JwtExceptionHandlerFilter(), JwtAuthFilter.class)
                
                .exceptionHandling((exceptionHandling) ->
                        exceptionHandling.accessDeniedHandler(new JwtAccessDeniedHandler())
        );
        return http.build();
    }

    @Bean
    public JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter() {
        JsonUsernamePasswordAuthenticationFilter jsonUsernamePasswordAuthenticationFilter = new JsonUsernamePasswordAuthenticationFilter(objectMapper, jwtUtil /*, loginSuccessHandler, loginFailureHandler*/);
        jsonUsernamePasswordAuthenticationFilter.setAuthenticationManager(authManager());
        return jsonUsernamePasswordAuthenticationFilter;
    }

    @Bean
    public AuthenticationManager authManager() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        provider.setUserDetailsService(loginService);

        return new ProviderManager(provider);
    }
}
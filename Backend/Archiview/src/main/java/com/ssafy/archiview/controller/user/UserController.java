package com.ssafy.archiview.controller.user;

import com.ssafy.archiview.dto.token.TokenDto;
import com.ssafy.archiview.dto.user.UserDto;
import com.ssafy.archiview.jwt.jwtUtil;
import com.ssafy.archiview.response.code.SuccessCode;
import com.ssafy.archiview.response.structure.SuccessResponse;
import com.ssafy.archiview.service.user.UserService;
import com.ssafy.archiview.validation.user.UserId;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService service;
    private final jwtUtil jwtUtil;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    @PostMapping
    public ResponseEntity<Object> userAdd(@RequestBody @Valid UserDto.AddRequestDto requestDto) {
        service.userAdd(requestDto);
        return SuccessResponse.createSuccess(SuccessCode.JOIN_SUCCESS);
    }
    @GetMapping("/logout")
    public ResponseEntity<Object> userLogout(HttpServletRequest request){
        String userId = jwtUtil.getUsername(request);
        System.out.println(userId);
        service.userLogout(userId);
        return SuccessResponse.createSuccess(SuccessCode.LOGOUT_SUCCESS);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> userDetail(@PathVariable @UserId String id) {
        UserDto.DetailResponseDto responseDto = service.userDetail(id);
        return SuccessResponse.createSuccess(SuccessCode.USER_DETAIL_SUCCESS, responseDto);
    }
//    @DeleteMapping("/delete")
//    public ResponseEntity<Object> userDelete(HttpServletRequest request){
//       return service.userDelete(request);
//    }
}


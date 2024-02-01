package com.ssafy.archiview.controller.admin;


import com.ssafy.archiview.dto.user.UserDto;
import com.ssafy.archiview.response.code.SuccessCode;
import com.ssafy.archiview.response.structure.SuccessResponse;
import com.ssafy.archiview.service.question.QuestionService;
import com.ssafy.archiview.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminController {
    private final UserService userService;
    private final QuestionService questionService;

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<Object> questionDelete(@PathVariable("questionId") int questionId) {
        questionService.deleteQuestion(questionId);
        return SuccessResponse.createSuccess(SuccessCode.DELETE_QUESTION_SUCCESS);
    }
}

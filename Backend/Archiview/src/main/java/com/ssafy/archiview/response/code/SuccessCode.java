package com.ssafy.archiview.response.code;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum SuccessCode implements ResponseCode {
    /*
        USER
     */
    LOGIN_SUCCESS(HttpStatus.OK, "로그인에 성공했습니다."),
    JOIN_SUCCESS(HttpStatus.CREATED, "회원가입에 성공했습니다."),

    /*
        QUESTION
     */
    DELETE_QUESTION_SUCCESS(HttpStatus.OK, "질문 삭제에 성공했습니다."),

    /*
        LIKE
     */
    CREATE_LIKE_SUCCESS(HttpStatus.CREATED, "추천에 성공했습니다."),
    DELETE_LIKE_SUCCESS(HttpStatus.CREATED, "추천 삭제에 성공했습니다."),

    /*
        COMMENT
     */
    CREATE_COMMENT_SUCCESS(HttpStatus.CREATED, "댓글 작성에 성공했습니다."),
    DELETE_COMMENT_SUCCESS(HttpStatus.CREATED, "댓글 삭제에 성공했습니다."),

    /*
        REPLY
     */
    CREATE_REPLY_SUCCESS(HttpStatus.CREATED, "질문/답변 생성에 성공했습니다."),
    SELECT_REPLY_SUCCESS(HttpStatus.CREATED, "답변 조회에 성공했습니다."),
    DELETE_REPLY_SUCCESS(HttpStatus.OK, "내 답변 삭제에 성공했습니다."),
    ;
    private final HttpStatus httpStatus;
    private final String message;
}

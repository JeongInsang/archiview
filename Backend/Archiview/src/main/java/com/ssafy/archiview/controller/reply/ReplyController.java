package com.ssafy.archiview.controller.reply;

import com.ssafy.archiview.dto.comment.CommentDto;
import com.ssafy.archiview.dto.reply.ReplyDto;
import com.ssafy.archiview.response.code.SuccessCode;
import com.ssafy.archiview.response.structure.SuccessResponse;
import com.ssafy.archiview.service.reply.ReplyService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.ssafy.archiview.jwt.jwtUtil;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/replies")
public class ReplyController {
    private final ReplyService service;
    private final jwtUtil jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<Object> replyDetail(@PathVariable("id") int id, HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);
        ReplyDto.DetailResponseDto responseDto = service.replyDetail(new ReplyDto.DetailRequestDto(id, userId));
        return SuccessResponse.createSuccess(SuccessCode.SELECT_REPLY_SUCCESS, responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> replyDelete(@PathVariable("id") int id, HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);
        service.replyDelete(new ReplyDto.DeleteRequestDto(id, userId));
        return SuccessResponse.createSuccess(SuccessCode.DELETE_REPLY_SUCCESS);
    }

    @PostMapping
    public ResponseEntity<Object> replyAdd(@RequestBody ReplyDto.AddRequestDto requestDto, HttpServletRequest request) {
        requestDto.userIdUpdate(jwtUtil.getUsername(request));
        service.replyAdd(requestDto);
        return SuccessResponse.createSuccess(SuccessCode.CREATE_REPLY_SUCCESS);
    }

    @PatchMapping
    public ResponseEntity<Object> replyModify(@RequestBody ReplyDto.ModifyRequestDto requestDto, HttpServletRequest request) {
        requestDto.userIdUpdate(jwtUtil.getUsername(request));
        service.replyModify(requestDto);
        return SuccessResponse.createSuccess(SuccessCode.MODIFY_REPLY_SUCCESS);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    @PostMapping("/{id}/like")
    public ResponseEntity<Object> replyLike(@PathVariable("id") int id, HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);
        ReplyDto.LikeResponseDto responseDto = service.replyLike(
                ReplyDto.LikeRequestDto.builder()
                        .id(id)
                        .userId(userId).build());
        return SuccessResponse.createSuccess(SuccessCode.CREATE_LIKE_SUCCESS, responseDto);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'MEMBER')")
    @DeleteMapping("/{id}/like")
    public ResponseEntity<Object> replyLikeDelete(@PathVariable("id") int id, HttpServletRequest request) {
        service.replyLikeDelete(new ReplyDto.LikeDeleteRequest(id, jwtUtil.getUsername(request)));
        return SuccessResponse.createSuccess(SuccessCode.DELETE_LIKE_SUCCESS);
    }


    @PostMapping("/{id}/comment")
    public ResponseEntity<Object> replyComment(@PathVariable("id") int id, @RequestBody CommentDto.request requestDto, HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);

        List<CommentDto.info> responseDto = service.replyComment(CommentDto.request.builder()
                .replyId(id)
                .content(requestDto.getContent())
                .userId(userId).build());
        
        return SuccessResponse.createSuccess(SuccessCode.CREATE_COMMENT_SUCCESS, responseDto);
    }

    @DeleteMapping("/{id}/comment")
    public ResponseEntity<Object> replyCommentDelete(@PathVariable("id") int id, HttpServletRequest request) {
        String userId = jwtUtil.getUsername(request);
        service.replyCommentDelete(new ReplyDto.CommentDeleteRequest(id, userId));
        return SuccessResponse.createSuccess(SuccessCode.DELETE_COMMENT_SUCCESS);
    }
}

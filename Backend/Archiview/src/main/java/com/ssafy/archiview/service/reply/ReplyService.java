package com.ssafy.archiview.service.reply;

import com.ssafy.archiview.dto.reply.ReplyDto;

import java.util.List;

public interface ReplyService {
    // 답변 상세 조회
    ReplyDto.DetailResponseDto replyDetail(ReplyDto.DetailRequestDto requestDto);
    // 답변 삭제
    void replyDelete(int id);
    // 추천 생성
    ReplyDto.LikeResponseDto replyLike(ReplyDto.LikeRequestDto requestDto);
    // 추천 삭제
    void replyLikeDelete(int id);
    // 댓글 생성
    List<ReplyDto.CommentResponseDto> replyComment(ReplyDto.CommentRequestDto requestDto);
    // 댓글 삭제
    void replyCommentDelete(int id);
}

package com.ssafy.archiview.service.recruit;

import com.ssafy.archiview.dto.recruit.RecruitDto;
import com.ssafy.archiview.entity.Question;
import com.ssafy.archiview.entity.Recruit;
import com.ssafy.archiview.repository.QuestionRepository;
import com.ssafy.archiview.repository.RecruitRepository;
import com.ssafy.archiview.response.code.ErrorCode;
import com.ssafy.archiview.response.exception.RestApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruitServiceImpl implements RecruitService {
    private final RecruitRepository recruitRepository;
    private final QuestionRepository questionRepository;
    @Override
    public List<RecruitDto.DetailListResponseDto> recruitDetailList(RecruitDto.DetailListRequestDto requestDto) {
        LocalDate base = LocalDate.parse(requestDto.getDate());
        LocalDateTime start = base.withDayOfMonth(1).atStartOfDay();
        LocalDateTime end = base.withDayOfMonth(base.lengthOfMonth()).atTime(LocalTime.MAX);
        return recruitRepository.findAllByStartBetween(start, end).stream()
                .map(Recruit::toDetailListDto)
                .collect(Collectors.toList());
    }

    @Override
    public RecruitDto.DetailResponseDto recruitDetail(int id) {
        Recruit recruit = recruitRepository.findById(id)
                .orElseThrow(() -> new RestApiException(ErrorCode.RECRUIT_NOT_FOUND));
        // 질문 가져올 기준 정해야됨(답변, 댓글, 좋아요 등등)
        List<Question> questions = questionRepository.findTop5ByCompanyId(recruit.getCompany().getId());

        return RecruitDto.DetailResponseDto.builder()
                .recruit(recruit.toInfoDto())
                .company(recruit.getCompany().toDto())
                .questions(questions.stream()
                        .map(Question::toDto)
                        .collect(Collectors.toList()))
                .build();
    }
}

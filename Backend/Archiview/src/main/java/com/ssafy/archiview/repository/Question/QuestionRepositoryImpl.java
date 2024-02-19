package com.ssafy.archiview.repository.Question;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.archiview.dto.question.QuestionDto;
import com.ssafy.archiview.entity.*;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;

import java.util.List;

@RequiredArgsConstructor
public class QuestionRepositoryImpl implements QuestionRepositoryCustom{
    private final JPAQueryFactory factory;
    @Override
    public List<Question> searchQuestion(QuestionDto.SearchRequest requestDto) {
        QQuestion question = QQuestion.question;
        QCompany company = QCompany.company;
        QCsSubQuestion csSubQuestion = QCsSubQuestion.csSubQuestion;
        QJobSubQuestion jobSubQuestion = QJobSubQuestion.jobSubQuestion;
        QReply reply = QReply.reply;

        BooleanBuilder andBuilder = new BooleanBuilder();
        BooleanBuilder orBuilder = new BooleanBuilder();

        final int SizeConstant = 10;
        final int pgno = requestDto.getPgno() * SizeConstant - SizeConstant;

        if(StringUtils.hasText(requestDto.getUserId())) {
            andBuilder.and(reply.user.id.eq(requestDto.getUserId()));
        } else {
            andBuilder.and(reply.user.role.eq(Role.ROLE_MEMBER));
        }

        if(StringUtils.hasText(requestDto.getCompanyName())) {
            andBuilder.and(question.company.name.eq(requestDto.getCompanyName()));
        }

        if(!requestDto.getCsList().isEmpty()) {
            for(String cs : requestDto.getCsList()) {
                if(StringUtils.hasText(cs)) {
                    orBuilder.or(csSubQuestion.csSub.name.eq(cs));
                }
            }
        }

        if(!requestDto.getJobList().isEmpty()) {
            for(String js : requestDto.getJobList()) {
                if(StringUtils.hasText(js)) {
                    orBuilder.or(jobSubQuestion.jobSub.name.eq(js));
                }
            }
        }

        return factory.select(question)
                .from(question)
                .join(question.company, company)
                .join(question.replyList, reply)
                .leftJoin(question.csSubQuestionList, csSubQuestion)
                .leftJoin(question.jobSubQuestionList, jobSubQuestion)
                .where(andBuilder.and(orBuilder))
                .distinct()
                .offset(pgno)
                .limit(SizeConstant)
                .fetch();
    }
}

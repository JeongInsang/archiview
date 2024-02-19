import { TextField } from "@mui/material";
import React from "react";
import SearchTab from "../SCH_P_01/tabCompo";
import BtnGroupInsert from "./btnGroupInsert";
import OpenVideo from "../MYI_P_02/openVideo";
import { useState } from "react";
import { createReply } from "../../api/replyAPI";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCompany } from "../../store/slice/replySlice";

const InsertForm = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  // 실제 데이터로 수정할 때 주석 해제하고 더미데이터 삭제할 것
  const [content, setContent] = useState();
  const [script, setScript] = useState();
  const [csList, setCsList] = useState();
  const [jobList, setJobList] = useState();
  const [sessionUrl, setSessionUrl] = useState();

  const [questions, setQuestions] = useState();
  const [userId, setUserId] = useState();

  const dispatch = useDispatch();
  const { selectedCompany } = useSelector((state) => state.reply);

  function handlerContent(event) {
    setContent(event.target.value);
  }
  function handlerScript(event) {
    setScript(event.target.value);
  }

  function onClickApply() {
    createReply(
      {
        Authorization: accessToken,
      },
      {
        companyId: selectedCompany.id,
        content: content,

        csList: csList,
        jobList: jobList,

        questionId: 0,
        script: script,
        videoUrl: sessionUrl,
        thumbnailUrl: sessionUrl,
      },
      (resp) => {
        navigate("/myinterview", { replace: true });
      }
    );
  }
  function onClickCancle() {
    navigate("/myinterview", { replace: true });
  }

  return (
    <div>
      <TextField
        className="Insert-title"
        id="filled-basic"
        label="제목"
        variant="filled"
        onChange={handlerContent}
      />

      <div className="Insert-search">
        <SearchTab
          setQuestions={setQuestions}
          setCsList={setCsList}
          setJobList={setJobList}
          userId={userId}
        ></SearchTab>
      </div>

      <OpenVideo setSessionUrl={setSessionUrl}></OpenVideo>
      <br />

      <TextField
        className="Insert-script"
        id="filled-multiline-static"
        label="스크립트"
        multiline
        rows={4}
        defaultValue=""
        variant="filled"
        style={{ paddingTop: "5px" }}
        onChange={handlerScript}
      />
      <BtnGroupInsert
        onClickApply={onClickApply}
        onClickCancle={onClickCancle}
      />
    </div>
  );
};

export default InsertForm;

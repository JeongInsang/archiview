import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SendIcon from "@mui/icons-material/Send";
import Logo from "../../assets/img/mainLogo-removebg-preview.png";
import CheckIcon from "@mui/icons-material/Check";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Tune } from "@mui/icons-material";
import { sendFindEmail, findPW } from "../../api/userAPI";

const FindPWModal = ({ onSwitch, setEmailToken, data }) => {
  const [showSignupFields, setShowSignupFields] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isChangeBtnDisabled, setIsChangeBtnDisabled] = useState(true);
  const [isIdValid, setIsIdValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isEmailEmpty, setIsEmailEmpty] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const [idValue, setIdValue] = useState("");
  const [authNum, setAuthNum] = useState("");
  const [inputAuthNum, setInputAuthNum] = useState("");

  // ID 입력 필드의 값이 변경 시 호출되는 함수
  const handleIdChange = (event) => {
    const newId = event.target.value;
    setIsIdValid(/^[a-z0-9]{4,16}$/.test(newId));
    // 나머지 코드 유지
    setIdValue(newId);
  };

  // 이메일 입력 필드의 값이 변경 시 호출되는 함수
  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setIsEmailValid(
      /[0-9a-zA-Z][-_￦.]*[0-9a-zA-Z]*\@[0-9a-zA-Z]*\.[a-zA-Z]{2,3}$/.test(
        newEmail
      )
    );
    setEmailValue(newEmail);
    setIsEmailEmpty(newEmail.trim() === ""); // 이메일이 비어있는지 여부를 검사하여 상태 업데이트
    // 나머지 코드 유지
  };

  const handleVerifyClick = () => {
    setIsInputDisabled(true); // 버튼을 비활성화 시킴
    sendFindEmail(
      { email: emailValue },
      (resp) => {
        setShowSignupFields(true); // 인증번호 필드를 보여줌
        setEmailToken(resp.data.data.emailToken);
        setAuthNum(resp.data.data.authNumber);
      },
      (error) => {
        setIsInputDisabled(false); // 버튼을 비활성화 시킴
      }
    );
  };

  const handleAuthClick = () => {
    if (inputAuthNum === String(authNum)) {
      setIsChangeBtnDisabled(false);
    } else {
      alert("인증번호가 다릅니다.");
    }
  };

  // '비밀번호 변경' 버튼 클릭시 핸들러 함수
  const handleAssignClick = () => {
    findPW(
      {
        id: idValue,
        email: emailValue,
      },
      (resp) => {
        onSwitch("ChangePW");
      },
      (error) => {
        alert("인증에 실패했습니다.");
      }
    );
  };

  // 엔터 입력시
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (isEmailValid && !isEmailEmpty && isIdValid && idValue !== "") {
        handleVerifyClick();
      }
    }
  };

  const handleAuthKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAuthClick();
    }
  };

  const handleAuthChange = (e) => {
    const inputAuthValue = e.target.value;
    setInputAuthNum(inputAuthValue);
  };

  return (
    <div className="LOG-M-01-Content">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="Logo">
            <img src={Logo} style={{ width: "65%" }} alt="" />
          </div>
        </Grid>

        <Grid item xs={12}>
          <TextField
            className="ID-input"
            style={{ width: "100%" }}
            required
            label="ID"
            placeholder="사용자 ID"
            variant="filled"
            onChange={handleIdChange}
            disabled={isInputDisabled}
            error={!isIdValid}
            helperText={!isIdValid ? "영소문자, 숫자 4~16자리 이내" : ""}
          />
        </Grid>

        {/* 이메일 인증 */}
        <Grid item xs={8}>
          <TextField
            className="PW-input"
            required
            label="이메일"
            placeholder="example@mail.com"
            defaultValue=""
            variant="filled"
            onChange={handleEmailChange}
            onKeyDown={handleKeyPress}
            error={!isEmailValid}
            helperText={!isEmailValid ? "이메일 양식 확인" : ""}
            disabled={isInputDisabled}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            style={{ height: "56px", width: "100%" }}
            onClick={handleVerifyClick} // 버튼 클릭 핸들러
            disabled={
              !isEmailValid ||
              isEmailEmpty ||
              isInputDisabled ||
              !isIdValid ||
              idValue === ""
            }
            onKeyDown={handleKeyPress}
          >
            인증하기
          </Button>
        </Grid>

        {/* 이메일 인증번호 & 회원가입 완료 버튼 */}
        {showSignupFields && (
          <>
            <Grid item xs={8}>
              <TextField
                className="PW-input"
                required
                label="인증번호"
                placeholder="인증번호 입력"
                disabled={!isChangeBtnDisabled}
                variant="filled"
                onChange={handleAuthChange}
                onKeyDown={handleAuthKeyPress}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                variant="contained"
                endIcon={<TaskAltIcon />}
                style={{ height: "56px", width: "100%" }}
                onClick={handleAuthClick} // 버튼 클릭 핸들러
                disabled={!isChangeBtnDisabled}
              >
                인증확인
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                className="Login-btn"
                variant="contained"
                endIcon={<AssignmentTurnedInIcon />}
                color="success"
                style={{ height: "56px" }}
                onClick={handleAssignClick}
                disabled={isChangeBtnDisabled}
              >
                비밀번호 변경하기
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default FindPWModal;

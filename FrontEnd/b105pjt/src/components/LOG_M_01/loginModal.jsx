import { Button, Grid, TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import React, { useState } from "react";
import LoginIcon from "@mui/icons-material/Login";
import "../../assets/css/LOG_M_01_login.css";
import Logo from "../../assets/img/mainLogo-removebg-preview.png";
import { login } from "../../api/userAPI";
import { useForm } from "../../utils/useForm";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/cookie";
import { closeModal } from "../../store/slice/modalSlice";
import { userLogin } from "../../store/slice/userSlice";

const LoginModal = ({ onSwitch }) => {
  const dispatch = useDispatch();

  // API 관리 변수들 추가
  const navigate = useNavigate();
  const initialState_login = {
    id: "", // varchar(16) 유저의 아이디
    pw: "", // 최소 9자, 최대 16자, 영문+숫자+특수문자 조합
  };

  const [form, handleFormChange, handleFileChange, resetForm] =
    useForm(initialState_login);

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [foundId, setFoundId] = useState(null);
  const [message, setMessage] = useState("");

  const close = () => {
    dispatch(closeModal());
  };

  const handleClickFindID = () => {
    onSwitch("FindID");
  };

  const handleClickFindPW = () => {
    onSwitch("FindPW");
  };

  const handleClickAssignUser = () => {
    onSwitch("Assign");
  };

  const handleLoginAxios = async () => {
    setMessage("");
    login(
      form,
      (resp) => {
        if (resp.data.data.role === "ROLE_BLOCK") {
          setMessage("정지된 유저입니다.");
          navigate("/");
        } else {
          setCookie("refreshToken", resp.data.data.refreshToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            SameSite: true,
            Referrer: true,
            maxAge: 60 * 60 * 24 * 7,
          });

<<<<<<< HEAD
          dispatch({
            type: "LOGIN",
            accessToken: resp.data.data.accessToken,
            role: resp.data.data.role,
            userId: resp.data.data.id,
            profile: "홈페이지 URL/api/files/profile/" + resp.data.data.id,
          });
=======
          dispatch(
            userLogin({
              accessToken: resp.data.data.accessToken,
              role: resp.data.data.role,
              userId: resp.data.data.id,
              profile:
                "홈페이지 URL/profile/" +
                resp.data.data.id,
            })
          );
>>>>>>> c6e04b5b9268193af9871fba61e776c4c9cc55b6
          localStorage.setItem("accessToken", resp.data.data.accessToken);
          resetForm();
          close();
        }
      },

      (error) => {
        console.error("데이터 전송 오류:", error);
        setMessage("아이디 및 패스워드를 확인해주세요.");
      }
    );
  };

  const handleIdChange = (event) => {
    handleFormChange(event);
    setId(event.target.value);
  };

  const handlePwChange = (event) => {
    handleFormChange(event);
    setPw(event.target.value);
  };

  const handleCloseResult = () => {
    setFoundId(null); // 찾은 아이디 상태 초기화
    close(); // 로그인 모달 닫기
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLoginAxios();
    }
  };

  return (
    <>
      {Logo && (
        <div className="LOG-M-01-Content">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="Logo">
                <img src={Logo} style={{ width: "65%" }} alt="" />
              </div>
            </Grid>

            <Grid item xs={12}>
              <TextField
                className="Form-input"
                required
                label="ID"
                name="id"
                defaultValue=""
                variant="filled"
                onKeyDown={handleKeyPress}
                onChange={handleIdChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                className="Form-input"
                required
                type="password"
                label="PW"
                name="pw"
                defaultValue=""
                variant="filled"
                onKeyDown={handleKeyPress}
                onChange={handlePwChange}
              />
            </Grid>
            <Grid item xs={12}>
              <span style={{ color: "red", fontSize: 13 }}>{message}</span>
            </Grid>
            <Grid item xs={12}>
              <Button
                className="Login-btn"
                variant="contained"
                endIcon={<LoginIcon />}
                onClick={handleLoginAxios}
                color="primary"
              >
                로그인
              </Button>
            </Grid>

            <Grid className="Link-group" item xs={12}>
              <div
                className="hoverable-div"
                onClick={handleClickFindID}
                style={{ marginRight: "20px", cursor: "default" }}
              >
                아이디 찾기
              </div>
              <div
                className="hoverable-div"
                onClick={handleClickFindPW}
                style={{
                  borderRight: "1px solid #000",
                  borderLeft: "1px solid #000",
                  padding: "0 20px",
                  cursor: "default",
                }}
              >
                비밀번호 찾기
              </div>
              <div
                className="hoverable-div"
                onClick={handleClickAssignUser}
                style={{ marginLeft: "20px", cursor: "default" }}
              >
                회원가입
              </div>
            </Grid>
          </Grid>
          {foundId && <indIDResult id={foundId} onClose={handleCloseResult} />}
        </div>
      )}
    </>
  );
};

export default LoginModal;

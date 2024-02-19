import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import ConfirmModal from "./confirmModal";
import { useNavigate } from "react-router-dom";
import { changePW } from "../../api/userAPI";
import { useSelector } from "react-redux";

const validatePassword = (password) => {
  const regex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*+=-])(?=.*[0-9]).{9,16}$/;
  return regex.test(password);
};

const InfoSection = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.user);

  useEffect(() => {
    if (!validatePassword(password)) {
      setPasswordError(
        "대소문자, 특수문자, 숫자를 포함한 9~16자리여야 합니다."
      );
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 서로 일치하지 않습니다.");
    } else {
      setConfirmPasswordError("");
    }
  }, [password, confirmPassword]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.key === "Enter" && !passwordError && !confirmPasswordError) {
      handleSave();
    }
  };

  const handleSave = () => {
    if (!passwordError && !confirmPasswordError) {
      setModalOpen(true);
    }
  };

  const handleConfirm = async () => {
    await changePW(
      {
        pw: password,
      },
      {
        Authorization: accessToken,
      }
    )
      .then((resp) => {
        alert("비밀번호가 변경되었습니다.");
      })
      .catch((error) => {
        alert("비밀번호 변경에 실패했습니다.");
      });

    setModalOpen(false); // 모달 닫기
    navigate("/mypage", { replace: true });
  };

  const isButtonDisabled =
    passwordError !== "" ||
    confirmPasswordError !== "" ||
    !password ||
    !confirmPassword;

  return (
    <div>
      <Card
        variant="outlined"
        elevation={3}
        sx={{
          mb: 2,
          width: "100%",
          maxWidth: "340px",
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 0.5, fontWeight: "bold", color: "primary.main" }}
          >
            비밀번호 변경
          </Typography>
          <TextField
            label="새 비밀번호"
            type="password"
            variant="outlined"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            error={!!passwordError}
            helperText={passwordError}
            sx={{ mb: 2 }}
          />
          <TextField
            label="비밀번호 재입력"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onKeyDown={handleEnter}
            fullWidth
            margin="normal"
            error={!!confirmPasswordError}
            helperText={confirmPasswordError}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isButtonDisabled}
            sx={{ mt: 3, width: "100%" }}
          >
            비밀번호 변경
          </Button>
          <ConfirmModal
            open={isModalOpen}
            onConfirm={handleConfirm}
            onCancel={() => setModalOpen(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoSection;

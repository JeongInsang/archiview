import React, { useState } from "react";
import {
  Box,
  Modal,
  TextField,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close"; // 닫기 아이콘을 위한 임포트
import { validPW } from "../../api/userAPI";
import { useSelector } from "react-redux";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

// currentPassword는 현재 사용자가 입력한 비밀번호를 저장하는 상태
// 'error' : 비밀번호 확인 과정에서 발생한 오류 메시지를 저장
const PasswordCheckModal = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState(""); // 오류 메시지 상태를 추가합니다.
  const navigate = useNavigate();

  const { accessToken } = useSelector((state) => state.user);

  // 내 캘린더 클릭시
  const moveMypage = () => {
    navigate("/modify", { replace: true });
  };

  const onPasswordVerified = () => {
    // 비밀번호 검증 과정 -> 로그인과 동일 동작
  };

  // 사용자가 비밀번호 입력 필드에 타이핑할 때마다 호출되는 함수, 입력된 비밀번호 값을 'currentPassword'에 저장
  // 이미 오류 메시지가 표시된 상태라면 이를 초기화
  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
    if (error) setError("");
  };

  // '확인' 버튼 클릭 시 호출되는 함수 -> 저장된 'currentPassword' 값을 검증하고 맞는지 확인
  // 맞는 경우, 'onPasswordVerified' 함수를 호출하고 모달을 닫음.
  // 틀린 경우, 오류 메시지를 저장하여 사용자에게 표시
  const handleSubmit = () => {
    // 현재 비밀번호 확인 로직 구현
    validPW(
      accessToken,
      { pw: currentPassword },
      (resp) => {
        onPasswordVerified();
        onClose();
        moveMypage();
      },
      (error) => {
        alert("비밀번호를 다시 확인해주세요.");
      }
    );
  };
  // 키보드 이벤트 핸들러
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(); // Enter 키를 누르면 handleSubmit 호출
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          비밀번호 확인
        </Typography>
        <TextField
          margin="normal"
          required
          fullWidth
          label="현재 비밀번호"
          type="password"
          value={currentPassword}
          onChange={handleCurrentPasswordChange}
          onKeyPress={handleKeyPress}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
          autoFocus
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleSubmit}
        >
          확인
        </Button>
      </Box>
    </Modal>
  );
};

export default PasswordCheckModal;

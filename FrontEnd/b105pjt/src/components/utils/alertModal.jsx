import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen"; // 로그인 아이콘 추가
import { useDispatch, useSelector } from "react-redux";
import { closeAlert, openModal } from "../../store/slice/modalSlice";

const AlertModal = () => {
  const dispatch = useDispatch();
  const { alertMessage, isAlertOpen } = useSelector((state) => state.modal);
  const { isLoggedIn } = useSelector((state) => state.user);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #1976d2", // 테두리 색상 변경
    borderRadius: "10px", // 테두리 둥글게
    boxShadow: 24,
    p: 4,
    textAlign: "center", // 텍스트 중앙 정렬
  };

  const alertClose = () => {
    dispatch(closeAlert());
  };

  const onConfirm = () => {
    dispatch(closeAlert());
    if (!isLoggedIn) {
      dispatch(openModal());
    }
  };

  return (
    <Modal
      open={isAlertOpen}
      onClose={alertClose}
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-description"
    >
      <Box sx={style}>
        <LockOpenIcon color="primary" sx={{ fontSize: 60 }} />{" "}
        {/* 아이콘 추가 */}
        <Typography
          id="alert-modal-title"
          variant="h6"
          component="h2"
          sx={{ mt: 2, mb: 2 }}
          style={{ whiteSpace: "pre-line" }}
        >
          {alertMessage}
        </Typography>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          확인
        </Button>
      </Box>
    </Modal>
  );
};

export default AlertModal;

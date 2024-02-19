import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import PasswordChangeModal from "./passwordModal";
import PasswordCheckModal from "./passwordCheck"; // 비밀번호 확인 모달 import
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signout } from "../../api/userAPI";
import { userLogout } from "../../store/slice/userSlice";

// 확인 다이얼로그 컴포넌트
// onConfirm 함수는 회원 탈퇴를 확인할 때 호출되는 함수 -> 이건 ActionButton 컴포넌트에서 정의된 'handleConfirmDelete' 함수
const ConfirmationDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>회원 탈퇴</DialogTitle>
      <DialogContent>
        <DialogContentText>정말로 탈퇴하시겠습니까?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} color="primary">
          예
        </Button>
        <Button onClick={onClose} color="primary">
          아니오
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// 메인 컴포넌트 -> onDelete - 부모 컴포넌트에서 전달되는 회원탈퇴 처리 함수
const ActionButton = ({ onDelete }) => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openPasswordCheckModal, setOpenPasswordCheckModal] = useState(false);

  // 비밀번호 변경 모달 여는거 닫는거
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // 회원탈퇴를 확인하고 , onDelete 함수를 호출하는 함수 -> '예'를 누르면 이 함수 호출
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
    signout(
      {
        headers: {
          Authorization: accessToken,
        },
      },
      (resp) => {}
    );
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmDelete = () => {
    setOpenPasswordCheckModal(true);
  };

  const handlePasswordVerified = () => {
    onDelete();
    handleCloseConfirmDialog();
    setOpenPasswordCheckModal(false);
    dispatch(userLogout());
    navigate("/", { replace: true });
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          gap: theme.spacing(2),
          mt: 3,
          flexWrap: "wrap",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenModal}
          sx={{
            margin: theme.spacing(1),
          }}
        >
          비밀번호 변경
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleOpenConfirmDialog}
          sx={{
            margin: theme.spacing(1),
          }}
        >
          회원탈퇴
        </Button>
      </Box>

      <PasswordChangeModal open={openModal} onClose={handleCloseModal} />
      <ConfirmationDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmDelete}
      />
      <PasswordCheckModal
        open={openPasswordCheckModal}
        onClose={() => setOpenPasswordCheckModal(false)}
        onPasswordVerified={handlePasswordVerified}
      />
    </>
  );
};

export default ActionButton;

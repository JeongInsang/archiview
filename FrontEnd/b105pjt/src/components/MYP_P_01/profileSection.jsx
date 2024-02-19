import React, { useState } from "react";
import {
  Paper,
  IconButton,
  Avatar,
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close"; // 닫기 아이콘을 위한 임포트
import ActionButton from "../../components/MYP_P_01/actionButton";
import {
  userDetail,
  uploadProfileImage,
  updateUserDetail,
} from "../../api/mypageAPI";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../store/slice/userSlice";

const ProfileSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const accessToken = localStorage.getItem("accessToken");
  const { profile } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [introduce, setIntroduce] = useState("");

  useEffect(() => {
    userDetail(
      {
        headers: {
          Authorization: accessToken,
        },
      },
      (resp) => {
        setName(resp.data.data.name);
        if (resp.data.data.email) {
          setEmail(resp.data.data.email);
        }
        if (resp.data.data.introduce) {
          setIntroduce(resp.data.data.introduce);
        }
      }
    );
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCancle = () => {
    setOpenModal(false);
  };

  const handleDelete = () => {
    // 회원탈퇴 로직
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: "20px",
        margin: "20px auto",
        textAlign: "center",
        width: "40%",
        maxWidth: "300px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2 }}>
        Profile <hr />
      </Typography>

      <Box sx={{ position: "relative", mb: 2 }}>
        <Avatar
          src={profile}
          alt="Profile"
          sx={{ width: 150, height: 150, borderRadius: "50%" }}
        />
        <IconButton
          color="primary"
          onClick={handleOpenModal}
          sx={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "grey.200",
            },
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      <Box sx={{ textAlign: "center", width: "100%" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {name}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {email}
        </Typography>
        <Typography sx={{ mb: 3 }}>{introduce}</Typography>
        <Divider sx={{ width: "100%", my: 2 }} />
        <ActionButton onDelete={handleDelete} />
      </Box>
      <ProfileEditModal
        open={openModal}
        handleCancle={handleCancle}
        setIntroduce={setIntroduce}
        introduce={introduce}
      />
    </Paper>
  );
};

const ProfileEditModal = ({ open, handleCancle, setIntroduce, introduce }) => {
  const dispatch = useDispatch();
  const { accessToken, profile, userId } = useSelector((state) => state.user);

  const [newProfileUrl, setNewProfileUrl] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [newIntroduce, setNewIntroduce] = useState("");

  useEffect(() => {
    setNewProfileUrl(profile);
    setNewIntroduce(introduce);
  }, [open]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const newImageFile = event.target.files[0];
      setNewProfileUrl(URL.createObjectURL(newImageFile));
      setProfileFile(newImageFile);
    }
  };

  // 업데이트 버튼
  const handleUpdateBtn = () => {
    const formData = new FormData();

    if (profileFile) {
      formData.append("img", profileFile);
      uploadProfileImage(userId, formData, (resp) => {
        let profileURL;
        if (profile.includes("https")) {
          profileURL = "/profile/" + userId;
        } else {
          profileURL = "홈페이지 URL/api/files/profile/" + userId;
        }
        dispatch(
          updateProfile({
            profile: profileURL,
          })
        );
      });
    }

    updateUserDetail(
      {
        Authorization: accessToken,
      },
      {
        introduce: newIntroduce,
        profileUrl: "",
      },
      (resp) => {
        setIntroduce(newIntroduce);
      }
    );
    handleCancle();
  };

  const handleIntroduceChange = (event) => {
    setNewIntroduce(event.target.value);
  };

  return (
    <Modal open={open} onClose={handleCancle}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleCancle}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
          프로필 편집
        </Typography>
        <Box sx={{ position: "relative" }}>
          <Avatar
            src={newProfileUrl}
            alt="New Profile"
            sx={{ width: 150, height: 150, borderRadius: "50%", mb: 2 }}
          />
          <input
            id="profile"
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label
            htmlFor="profile"
            style={{
              position: "absolute",
              bottom: 15,
              right: 10,
            }}
          >
            <IconButton
              component="span"
              color="primary"
              sx={{
                backgroundColor: "white",
                "&:hover": {
                  backgroundColor: "grey.200",
                },
              }}
            >
              <EditIcon />
            </IconButton>
          </label>
        </Box>
        <TextField
          label="소개글"
          variant="outlined"
          multiline
          rows={3}
          fullWidth
          value={newIntroduce}
          onChange={handleIntroduceChange}
          sx={{ mt: 2, mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateBtn}
          sx={{ mt: 2, ml: "auto" }}
        >
          업데이트
        </Button>
      </Box>
    </Modal>
  );
};

export default ProfileSection;

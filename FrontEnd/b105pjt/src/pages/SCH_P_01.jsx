import React, { useState, useEffect, useRef } from "react";
import Tabcompo from "../components/SCH_P_01/tabCompo";
import Accordion from "../components/MYI_P_01/accordion.jsx";
import {
  createTheme,
  ThemeProvider,
  Container,
  Typography,
  Card,
  Grid,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { selectReply } from "../api/replyAPI.js";
import { openAlert } from "../store/slice/modalSlice.js";

// 커스텀 테마 정의
const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
});

const cardStyles = {
  boxShadow: theme.shadows[3],
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  maxHeight: 400,
  overflow: "hidden",
  transition: "transform 0.3s ease-in-out",
  cursor: "pointer", // 커서 포인터 추가
  "&:hover": {
    transform: "scale(1.05)",
  },
};

const textOverflowStyles = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

function SCH_P_01() {
  const { isLoggedIn, role, userId } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [questions, setQuestions] = useState([]);
  const [ref, inView] = useInView();
  const [replyDetails, setReplyDetails] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReply, setSelectedReply] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  const handleViewDetails = (reply) => {
    if (!isLoggedIn) {
      dispatch(
        openAlert({
          message: "로그인이 필요합니다.",
        })
      );
    } else {
      if (role === "ROLE_USER") {
        dispatch(
          openAlert({
            message:
              "MEMBER 등급이 아닙니다.\n답변을 작성하고, 등업 신청 부탁드립니다.",
          })
        );
        navigate("/myinterview");
      } else {
        selectReply(
          {
            Authorization: accessToken,
          },
          reply.id,
          (resp) => {
            setReplyDetails(resp.data.data.reply);
            setModalOpen(true);
          }
        );
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false); // 모달을 닫기
  };
  // 모달 컴포넌트
  const DetailModal = () => (
    <Dialog open={modalOpen} onClose={handleCloseModal}>
      <DialogContent>
        {replyDetails ? (
          <DialogContentText>
            <div
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "10px",
              }}
            >
              {replyDetails.question.content}
            </div>
            {/* 비디오 컨트롤러 */}
            <div>
              <video
                controls
                src={
                  "홈페이지 URL/api/files/recording/" + replyDetails.videoUrl
                }
                width="100%"
              ></video>
            </div>
            {replyDetails.script && (
              <div
                style={{
                  border: "1px solid #007BFF",
                  borderRadius: "3px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                {replyDetails.script}
              </div>
            )}
          </DialogContentText>
        ) : (
          <DialogContentText>Loading...</DialogContentText> // 데이터 로딩 중 표시
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Tabcompo
          setQuestions={setQuestions}
          inView={inView}
          questions={questions}
        />
        <Grid container spacing={2}>
          {questions.map((question, index) =>
            question.replies.map((reply) => (
              <Grid item xs={12} sm={6} md={4} key={reply.id}>
                <Card onClick={() => handleViewDetails(reply)} sx={cardStyles}>
                  <CardMedia
                    component="img"
                    sx={{
                      height: 140,
                      objectFit: "cover",
                      borderRadius: "15px 15px 0 0",
                      filter:
                        role === "ROLE_MEMBER" ||
                        role === "ROLE_ADMIN" ||
                        reply.userId === userId
                          ? "blur(0px)"
                          : "blur(10px)",
                    }}
                    image={"홈페이지 URL/thumbnail/" + reply.thumbnailUrl}
                    alt="Thumbnail Image"
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", ...textOverflowStyles }}
                    >
                      {question.content}
                    </Typography>
                    <Typography variant="body2" sx={{ ...textOverflowStyles }}>
                      {reply.script}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ ...textOverflowStyles }}
                    >
                      {question.companyName}
                      <br />
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ ...textOverflowStyles }}
                      color="primary"
                    >
                      {question.csList.map((item) => (
                        <span key={item}>#{item} </span>
                      ))}
                      {question.jobList.map((item) => (
                        <span key={item}>#{item} </span>
                      ))}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
        <DetailModal />
        <div ref={ref} />
      </Container>
    </ThemeProvider>
  );
}

export default SCH_P_01;

import React, { useState, useEffect } from "react";
import ProfileSection from "../components/MYI_P_01/profileSection.jsx";
import Accordion from "../components/MYI_P_01/accordion.jsx";
import SearchTab from "../components/SCH_P_01/tabCompo.jsx";
import {
  createTheme,
  ThemeProvider,
  Container,
  Typography,
  Card,
  Grid,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import MyNavbar from "../components/MYI_P_02/myNavbar.jsx";
import { useNavigate, useLocation, resolvePath } from "react-router-dom";
import AdminButton from "../components/MYP_P_01/adminButton.jsx";
import { userDetail, wantUpgrade } from "../api/userAPI.js";
import { searchQuestion } from "../api/mypageAPI.js";
import { setUserBlock, setUserDown, setUserUp } from "../api/adminAPI.js";
import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

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
// 카드 및 미디어 스타일 정의
const cardStyles = {
  boxShadow: theme.shadows[3],
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  maxHeight: 400,
  overflow: "hidden",
  transition: "transform 0.1s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.03)",
  },
};

const textOverflowStyles = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

const mediaStyles = {
  height: 140,
  objectFit: "cover",
  borderRadius: "15px 15px 0 0",
};

const MYI_P_01 = () => {
  const [questions, setQuestions] = useState([]);
  const [adminBtn, setAdminBtn] = useState(false);
  const [isUpgradBtn, setIsUpgradBtn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [profileData, setProfileData] = useState(null);
  const [block, setBlock] = useState(null);
  const [role, setRole] = useState(null);
  const [auth, setAuth] = useState(false);
  const [userId, setUserId] = useState(
    useSelector((state) => state.user.userId)
  );
  const [ref, inView] = useInView();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    // 관리자 페이지에서 보낸 데이터
    const eventData = location.state?.event;

    // 데이터가 없는경우 (일반 사용자)
    if (!eventData) {
      userDetail(accessToken, (resp) => {
        setUserId(resp.data.data.id);
        setRole(resp.data.data.role);
        setProfileData(resp.data.data);
        if (resp.data.data.auth) {
          setAuth(true);
        }
        searchQuestion(
          {
            Authorization: accessToken,
          },
          {
            userId: resp.data.data.id,
          },
          (resp) => {
            if (resp.data.data) setQuestions(resp.data.data);
          }
        );
      });
    }
    // admin 페이지에서 온 경우
    else {
      setAdminBtn(true);
      setRole(eventData.role);
      setUserId(eventData.id);
      if (eventData.auth !== "-") {
        setAuth(true);
      }
      setProfileData(eventData);
    }
  }, []);

  useEffect(() => {
    if (role === "ROLE_USER") {
      setIsUpgradBtn(true);
    }
  }, [role]);
  const handleViewDetails = (reply) => {
    navigate("/revise", { state: { reply } });
  };

  // 등업신청 버튼 클릭 시
  const handleUpgrade = () => {
    setIsUpgradBtn(false);
    wantUpgrade(accessToken, (resp) => {
      alert("신청이 완료되었습니다");
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <MyNavbar />
      <Container>
        {adminBtn && (
          <AdminButton
            blocked={block}
            role={role}
            onUpdate={(updatedData) => {
              switch (updatedData.role) {
                case "ROLE_USER":
                  setUserDown(userId, accessToken, (resp) => {});
                  break;
                case "ROLE_MEMBER":
                  setUserUp(
                    {
                      id: userId,
                      block: true,
                    },
                    accessToken,
                    (resp) => {},
                    (error) => {
                      alert("신청중인 유저가 아닙니다");
                    }
                  );
                  break;
                case "ROLE_BLOCK":
                  setUserBlock(userId, accessToken, (resp) => {});
                  break;
                default:
              }
            }}
          />
        )}
        {isUpgradBtn && (
          <Button
            disabled={auth}
            variant="outlined"
            color="info"
            onClick={handleUpgrade}
          >
            등업신청
          </Button>
        )}
        {profileData && (
          <ProfileSection
            imageUrl={
              "홈페이지 URL/api/files/profile/" + profileData.id ||
              "default-image-url.jpg"
            }
          >
            <Typography variant="h5" gutterBottom>
              {profileData.name}
            </Typography>
            <Typography variant="body1">
              {profileData.introduce || "마이페이지에서 소개말을 적어주세요."}
            </Typography>
          </ProfileSection>
        )}
        <SearchTab
          setQuestions={setQuestions}
          userId={userId}
          questions={questions}
          inView={inView}
        />
        <Grid container spacing={2}>
          {questions.map((question) =>
            question.replies.map((reply) => (
              <Grid item xs={12} sm={6} md={4} key={reply.id}>
                <Card
                  onClick={() => handleViewDetails(question)}
                  sx={cardStyles}
                >
                  <CardMedia
                    component="img"
                    sx={mediaStyles}
                    image={
                      "홈페이지 URL/api/files/thumbnail/" + reply.thumbnailUrl
                    }
                    alt="Thumbnail Image"
                  />
                  <CardContent>
                    <Typography
                      variant="subtitle1"
                      sx={{ ...textOverflowStyles, fontWeight: "bold" }}
                    >
                      {question.content}
                    </Typography>
                    <Typography variant="body2" sx={{ ...textOverflowStyles }}>
                      {reply.script}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
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
        <br></br>
        <div ref={ref} />
      </Container>
    </ThemeProvider>
  );
};

export default MYI_P_01;

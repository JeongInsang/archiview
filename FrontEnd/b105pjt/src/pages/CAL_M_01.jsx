import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Link,
} from "@mui/material";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import CreateIcon from "@mui/icons-material/Create";
import "../assets/css/CAL_M_01.css";
import { selectImg } from "../api/naverAPI";
import { detailCompanyRecruits } from "../api/calendarAPI";
import { CircularProgress } from "@mui/material";
import { updateCompany } from "../store/slice/replySlice";
import { openAlert } from "../store/slice/modalSlice";

const CAL_M_01 = (props) => {
  const { isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dense, setDense] = useState(false);
  const [dummyData, setDummyData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const title = props.event.title;

  const [urlHover, setUrlHover] = useState(false);
  const [questionListHover, setQuestionListHover] = useState(false);
  const defaultAnchorStyle = {
    color: "black",
    textDecoration: "none",
  };
  const hoverAnchorStyle = {
    ...defaultAnchorStyle,
    fontWeight: "bold",
    cursor: "pointer",
  };

  useEffect(() => {
    detailCompanyRecruits(props.event.id, (resp) => {
      setDummyData(resp.data.data);
    });

    selectImg(title, (response) => {
      const firstImage = response.data.data.imageUrl;
      setImageUrl(firstImage);
    });
  }, []);

  // "질문 더보기" 클릭 핸들러
  const handleMoreQuestionsClick = () => {
    dispatch(
      updateCompany({
        selectedCompany: {
          id: dummyData.company.id,
          name: dummyData.company.name,
        },
      })
    );

    navigate("/search"); // useNavigate 훅을 사용해 /search 경로로 이동
  };

  const handleClickListItem = () => {
    if (isLoggedIn) {
      dispatch(
        updateCompany({
          selectedCompany: {
            id: dummyData.company.id,
            name: dummyData.company.name,
          },
        })
      );
      navigate("/addquestion", { replace: true });
    } else {
      dispatch(
        openAlert({
          message: "로그인이 필요합니다.",
        })
      );
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid className="content-center" item xs={3}>
          {imageUrl ? (
            <img
              src={imageUrl}
              style={{ width: "140px", height: "100px" }}
              alt="img"
            />
          ) : (
            <div
              style={{
                width: "140px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </div>
          )}
        </Grid>
        <Grid item xs={9}>
          <Grid item xs={12}>
            <div className="border-line">
              <div className="title">{title}</div>
              <span>
                {dummyData.recruit &&
                  `${dummyData.recruit.start} ~ ${dummyData.recruit.end}`}
              </span>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="content-title">
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "10px 10px 0px 0px",
                    padding: "0px 5px 0px 5px",
                    backgroundColor: "transparent",
                    border: "1px solid black",
                    borderRadius: "10px",
                    height: "30px",
                  }}
                >
                  <a
                    href={dummyData.recruit && dummyData.company.url}
                    target="_blank"
                    style={urlHover ? hoverAnchorStyle : defaultAnchorStyle}
                    onMouseEnter={() => setUrlHover(true)}
                    onMouseLeave={() => setUrlHover(false)}
                  >
                    채용공고
                  </a>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "10px 10px 0px 0px",
                    padding: "0px 5px 0px 5px",
                    backgroundColor: "transparent",
                    border: "1px solid black",
                    borderRadius: "10px",
                    height: "30px",
                  }}
                >
                  <div
                    style={
                      questionListHover ? hoverAnchorStyle : defaultAnchorStyle
                    }
                    onMouseEnter={() => setQuestionListHover(true)}
                    onMouseLeave={() => setQuestionListHover(false)}
                    onClick={handleMoreQuestionsClick}
                  >
                    질문목록
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <List dense={dense}>
            {dummyData.questions && dummyData.questions.length > 0 ? (
              dummyData.questions.map((question) => (
                <ListItem
                  key={question.id}
                  className="listItem"
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="create"
                      onClick={handleClickListItem}
                    >
                      <CreateIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <ContactSupportIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={question.content} />
                </ListItem>
              ))
            ) : (
              <ListItem
                className="listItem"
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="create"
                    onClick={handleClickListItem}
                  >
                    <CreateIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <ContactSupportIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary="등록된 질문이 없습니다." />
              </ListItem>
            )}
          </List>
        </Grid>
      </Grid>
    </div>
  );
};

export default CAL_M_01;

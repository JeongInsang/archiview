import { Button, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SearchTab from "../SCH_P_01/tabCompo";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { OpenVidu } from "openvidu-browser";
import {
  getToken,
  startRecording,
  stopRecording,
  closeSession,
  deleteRecording,
  fetchAll,
  fetchInfo,
  forceDisconnect,
  forceUnpublish,
  getRecording,
  listRecordings,
} from "../../api/openViduAPI";
import { useDispatch, useSelector } from "react-redux";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import ConfirmModal from "./confirmModal";
import { setLoading, unSetLoading } from "../../store/slice/loadingSlice";
import { deleteReply, modifyReply } from "../../api/replyAPI";
import { useNavigate } from "react-router-dom";
import { deleteReplyByAdmin } from "../../api/adminAPI";

let session;
let publisher;
let sessionName;
let replyId;

const MakeSession = async (videoRef) => {
  const OV = new OpenVidu();
  session = OV.initSession();

  // 세션 이벤트와 스트림 구독
  session.on("streamCreated", (event) => {
    let subscriber = session.subscribe(event.stream, undefined);
    subscriber.addVideoElement(videoRef.current);
  });

  sessionName = "yourSessionName" + Date.now();

  try {
    const resp = await getToken({ sessionName: sessionName });

    let token = resp.data[0];
    await session.connect(token, { clientData: "example" });

    publisher = OV.initPublisher(videoRef.current, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: true,
      publishVideo: true,
      resolution: "1000X562",
      frameRate: 30,
      insertMode: "APPEND",
      mirror: false,
    });

    session.publish(publisher);
  } catch (error) {
    console.error("세션 설정 중 오류 발생:", error);
  }
};

const ModifyForm = (props) => {
  const videoRef = useRef(null); // 비디오 요소 참조를 위한 ref
  const [recordingURL, setRecordingURL] = useState(
    "홈페이지 URL/api/files/recording/" + props.reply.replies[0].videoUrl
  );
  replyId = props.reply.replies[0].id;
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();
  const title = props.reply.content;
  const [script, setScript] = useState(props.reply.replies[0].script);
  const [url, setUrl] = useState(props.reply.replies[0].videoUrl);

  useEffect(() => {
    // 컴포넌트 정리
    dispatch(setLoading());
    MakeSession(videoRef)
      .then(() => {
        dispatch(unSetLoading());
      })
      .catch((error) => {
        dispatch(unSetLoading());
      });

    return () => {
      if (session) {
        // 세션 및, 퍼블리셔 종료 로직
        if (publisher) {
          publisher = null;
        }
        // 세션 연결 해제
        session.disconnect();
      }
    };
  }, []);

  const handleRecordStart = () => {
    dispatch(setLoading());
    startRecording(
      {
        session: session.sessionId,
        outputMode: "COMPOSED",
        hasAudio: true,
        hasVideo: true,
      },
      (resp) => {
        setIsRecording(true);
        dispatch(unSetLoading());
      },
      (error) => {
        dispatch(unSetLoading());
      }
    );
  };

  const handleRecordStop = () => {
    dispatch(setLoading());
    let urlSession = session.sessionId;
    setUrl(urlSession);
    stopRecording(
      {
        recording: session.sessionId,
      },
      (resp) => {
        setRecordingURL("홈페이지 URL/api/files/recording/" + urlSession);
        setIsRecording(false);

        // 세션 및, 퍼블리셔 종료 로직
        if (publisher) {
          publisher.stream
            .getVideoElement()
            .parentNode.removeChild(publisher.stream.getVideoElement());
          session.unpublish(publisher);
        }
        session.disconnect();
        dispatch(unSetLoading());
      },
      (error) => {
        dispatch(unSetLoading());
      }
    );
  };

  const handleRestartRecording = () => {
    dispatch(setLoading());
    MakeSession(videoRef);
    setRecordingURL("");
    dispatch(unSetLoading());
  };

  return (
    <div>
      <TextField
        className="Insert-title"
        id="filled-basic"
        label="제목"
        variant="filled"
        value={title}
        style={{ marginBottom: "10px" }}
      />
      <div style={{ marginTop: "10px" }}>
        {recordingURL && (
          <div>
            <div>
              <video controls src={recordingURL} width="1000"></video>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="success"
                onClick={handleRestartRecording}
                endIcon={<RefreshRoundedIcon />}
              >
                다시 녹화하기
              </Button>
            </div>
          </div>
        )}
        {!recordingURL && (
          <div>
            <div ref={videoRef} autoPlay={true} />
            <div>
              <Button
                variant="contained"
                endIcon={<VideoCameraFrontIcon />}
                color="primary"
                onClick={handleRecordStart}
                disabled={isRecording} // 녹화 중에는 버튼 비활성화
              >
                녹화 시작
              </Button>
              <Button
                variant="contained"
                endIcon={<VideocamOffIcon />}
                color="primary"
                onClick={handleRecordStop}
                disabled={!isRecording} // 녹화 중이 아니면 버튼 비활성화
                style={{ marginLeft: "5px" }}
              >
                녹화 종료
              </Button>
            </div>
          </div>
        )}
      </div>
      <br />

      <TextField
        className="Insert-script"
        id="filled-multiline-static"
        label="스크립트"
        multiline
        rows={4}
        variant="filled"
        value={script}
        onChange={(e) => setScript(e.target.value)} // 스크립트 상태 업데이트
        style={{ paddingTop: "5px" }}
      />
      <BtnGroupInsert id={replyId} script={script} url={url} />
    </div>
  );
};

const BtnGroupInsert = ({ id, script, url }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const { role } = useSelector((state) => state.user);

  const handleEdit = () => {
    navigate("/myinterview");
    modifyReply(
      {
        id: id,
        script: script,
        videoUrl: url,
        thumbnailUrl: url,
      },
      token,
      (resp) => {},
      (err) => {}
    );
  };

  const handleDelete = () => {
    if (role === "ROLE_ADMIN") {
      deleteReplyByAdmin(replyId, token).then((resp) => {
        navigate("/myinterview");
      });
    } else {
      deleteReply(replyId, token, (resp) => {
        navigate("/myinterview");
      });
    }
  };

  return (
    <div className="Insert-btn-group">
      {role !== "ROLE_ADMIN" && (
        <Button
          variant="outlined"
          startIcon={<ModeEditIcon />}
          color="success"
          onClick={handleEdit}
        >
          수정
        </Button>
      )}
      <Button
        variant="contained"
        endIcon={<DeleteForeverIcon />}
        color="error"
        onClick={handleDelete}
      >
        삭제
      </Button>
    </div>
  );
};

export default ModifyForm;

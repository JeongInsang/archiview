import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { getToken, startRecording, stopRecording } from "../../api/openViduAPI";
import { useDispatch } from "react-redux";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

let session;
let publisher;
let sessionName;

const MakeSession = async (videoRef, dispatch) => {
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
    console.log("토큰 받기 성공:", resp.data[0]);

    let token = resp.data[0];
    await session.connect(token, { clientData: "example" });

    publisher = OV.initPublisher(
      videoRef.current,
      {
        audioSource: undefined, // 오디오 소스
        videoSource: undefined, // 비디오 소스
        publishAudio: true, // 오디오 발행 여부
        publishVideo: true, // 비디오 발행 여부
        resolution: "1000X562", // 해상도
        frameRate: 30, // 프레임레이트
        insertMode: "APPEND", // 삽입 모드
        mirror: false, // 미러 모드
      },
      () => {
        session.publish(publisher);
        dispatch({ type: "UNSET_LOADING" });
      },
      (error) => {
        console.error(error);
        dispatch({ type: "UNSET_LOADING" }); // 여기서도 로딩을 해제할 수 있지만, 오류를 적절히 처리하는 것이 중요합니다.
      }
    );
  } catch (error) {
    console.error("세션 설정 중 오류 발생:", error);
    dispatch({ type: "UNSET_LOADING" });
  }
};

const OpenVideo = ({ setSessionUrl }) => {
  const videoRef = useRef(null); // 비디오 요소 참조를 위한 ref
  const [recordingURL, setRecordingURL] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // 컴포넌트 정리
    dispatch({ type: "SET_LOADING" });

    MakeSession(videoRef, dispatch)
      .then(() => {
        console.log("MakeSession 성공");
      })
      .catch((error) => {
        console.error("MakeSession 오류:", error);
        dispatch({ type: "UNSET_LOADING" });
      });

    return () => {
      if (session) {
        // 세션 및, 퍼블리셔 종료 로직
        if (publisher) {
          publisher = null;
        }

        console.log("세션 종료:", session.sessionId);
        // 세션 연결 해제
        session.disconnect();
      }
    };
  }, []);

  const handleRecordStart = () => {
    console.log("sessionId: ", session.sessionId);
    dispatch({ type: "SET_LOADING" });
    startRecording(
      {
        session: session.sessionId,
        outputMode: "COMPOSED",
        hasAudio: true,
        hasVideo: true,
      },
      (resp) => {
        console.log("녹화 시작: ", resp);
        setIsRecording(true);
        dispatch({ type: "UNSET_LOADING" });
      },
      (error) => {
        console.log("에러 발생: ", error);
        dispatch({ type: "UNSET_LOADING" });
      }
    );
  };

  const handleRecordStop = () => {
    dispatch({ type: "SET_LOADING" });
    let urlSession = session.sessionId;
    setSessionUrl(session.sessionId);
    stopRecording(
      {
        recording: session.sessionId,
      },
      (resp) => {
        // Start - Signaling Server API
        console.log("녹화 종료: ", resp);
        setRecordingURL(
          "https://i10b105.p.ssafy.io/api/files/recording/" + urlSession
        );
        console.log(recordingURL);
        setIsRecording(false);

        // 세션 및, 퍼블리셔 종료 로직
        if (publisher) {
          publisher = null;
        }
        session.disconnect();
        // End - Signaling Server API

        dispatch({ type: "UNSET_LOADING" });
      },
      (error) => {
        console.log("에러 발생: ", error);
        dispatch({ type: "UNSET_LOADING" });
      }
    );
  };

  const handleRestartRecording = () => {
    dispatch({ type: "SET_LOADING" });
    MakeSession(videoRef, dispatch);
    setRecordingURL("");
    dispatch({ type: "UNSET_LOADING" });
  };

  return (
    <div>
      <div>
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
    </div>
  );
};

export default OpenVideo;

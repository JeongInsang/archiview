import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import LinearProgress from "@mui/material/LinearProgress";
import LoadingImg from "../../assets/img/loading.gif";
import { Backdrop } from "@mui/material";

const Loading = () => {
  const { isLoading } = useSelector((state) => state.loading);
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prevText) =>
        prevText.length < 10 ? prevText + "." : "Loading"
      );
    }, 500);
    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 인터벌 제거
  }, []);

  return (
    <div>
      {LoadingImg && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <div
            style={{
              width: "400px",
              height: "500px",
              borderRadius: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
            }}
          >
            <img
              style={{
                width: "40%",
                marginBottom: "30px",
              }}
              src={LoadingImg}
              alt="loading"
            />
            <p
              style={{ textAlign: "center", fontSize: "20px", color: "black" }}
            >
              {loadingText}
            </p>
            <div
              style={{
                width: "80%",
              }}
            >
              <LinearProgress />
            </div>
          </div>
        </Backdrop>
      )}
    </div>
  );
};

export default Loading;

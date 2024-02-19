import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // 닫기 아이콘
import LoginModal from "../components/LOG_M_01/loginModal";
import FindIDModal from "../components/LOG_M_01/findIDModal";
import FindPWModal from "../components/LOG_M_01/findPWModal";
import AssignUser from "../components/LOG_M_01/assignUser";
import ChangPWModal from "../components/LOG_M_01/changePWModal";
import { useDispatch } from "react-redux";
import { closeModal } from "../store/slice/modalSlice";
const LOG_M_01 = () => {
  const [currentComponent, setCurrentComponent] = useState("Login");
  const [emailToken, setEmailToken] = useState("");
  const dispatch = useDispatch();

  const switchComponent = (componentName) => {
    setCurrentComponent(componentName);
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "Login":
        return <LoginModal onSwitch={switchComponent} />;
      case "FindID":
        return <FindIDModal onSwitch={switchComponent} />;
      case "FindPW":
        return <FindPWModal onSwitch={switchComponent} setEmailToken={setEmailToken} />;
      case "Assign":
        return <AssignUser onSwitch={switchComponent} />;
      case "ChangePW":
        return <ChangPWModal onSwitch={switchComponent} emailToken={emailToken}/>;
      default:
        return null;
    }
  };
  return (
    <div style={{ position: "relative" }}>
      {/* 닫기 버튼 */}
      <IconButton
        aria-label="close"
        onClick={() => dispatch(closeModal())}
        style={{
          position: "absolute",
          right: -32,
          top: -5,
          color: "gray",
        }}
      >
        <CloseIcon />
      </IconButton>
      {renderComponent()}
    </div>
  );
};

export default LOG_M_01;

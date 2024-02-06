import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const MemberAuth = ({ children }) => {
    const role = useSelector((state) => state.role);
    const userId = useSelector((state) => state.userId);
    const { state } = useLocation();
    // URL 직접 접근일 경우
    if(state == null) {
        return <Navigate to="/" />
    }

    // 본인의 글일 경우
    if(userId === state.postId) {
        return children;
    }
    // 본인의 글이 아닐 경우
    return role === "ROLE_USER" || role === "" ? <Navigate to="/search"/> : children; 
}

export default MemberAuth
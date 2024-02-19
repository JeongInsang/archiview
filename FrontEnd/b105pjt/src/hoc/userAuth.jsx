import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UserAuth = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.user);

  return !isLoggedIn ? <Navigate to="/" /> : children;
};

export default UserAuth;

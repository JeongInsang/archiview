import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminAuth = ({ children }) => {
  const { role } = useSelector((state) => state.user);

  return role !== "ROLE_ADMIN" ? <Navigate to="/" /> : children;
};

export default AdminAuth;

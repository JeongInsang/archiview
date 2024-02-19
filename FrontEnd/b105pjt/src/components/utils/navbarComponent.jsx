import React from "react";
import Navbar from "./navbar";
import NavbarLogin from "./navbarLogin";
import { useSelector } from "react-redux";

const NavbarComponent = () => {
  const { isLoggedIn } = useSelector((state) => state.user);
  return <div>{isLoggedIn ? <Navbar /> : <NavbarLogin />}</div>;
};

export default NavbarComponent;

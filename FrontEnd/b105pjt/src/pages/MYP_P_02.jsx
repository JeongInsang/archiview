import React from "react";
import { Container, Typography, Box } from "@mui/material";
import ProfileSection from "../components/MYP_P_02/profileSection";
import InfoSection from "../components/MYP_P_02/infoSection";

const Page = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        paddingTop: "20px",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <InfoSection />
    </Container>
  );
};

export default Page;

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import koLocale from "@fullcalendar/core/locales/ko";
import "../assets/css/CAL_P_01.css";
import { IconButton, InputAdornment, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import CAL_M_01 from "./CAL_M_01";
import transformEventData from "../utils/transformEventData";
import { selectImg } from "../api/naverAPI";
import styled from "styled-components";
import NotificationAddOutlinedIcon from "@mui/icons-material/NotificationAddOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { selectAllRecruits, selectCompanyRecruits } from "../api/calendarAPI";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, unSetLoading } from "../store/slice/loadingSlice";

let today = new Date();
let year = today.getFullYear(); // 년도
let month = today.getMonth() + 1; // 월
let formattedMonth = month < 10 ? `0${month}` : `${month}`;
let date = year + "-" + formattedMonth + "-01";

const PageContainer = styled.div`
  margin-bottom: 30px;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: 700,
  overflowY: "auto",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  borderRadius: "10px",
};

const FullCalendarContainer = styled.div`
  max-width: 70%;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  .fc {
    max-width: 100%;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
  }

  .fc .fc-toolbar.fc-header-toolbar {
    padding: 10px 40px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #ddd;
  }

  .fc .fc-button-primary {
    color: #5a5a5a;
    font-size: 16px;
    border: none;
    background-color: transparent;

    :hover {
      background-color: #eaeaea;
    }

    :disabled {
      color: #ccc;
    }
  }

  .fc-theme-standard th {
    background: #f9f9f9;
    font-weight: 600;
    color: #333;
  }

  .fc .fc-daygrid-day.fc-day-today {
    background-color: #e3f2fd;
    color: #111;
  }

  .fc .fc-daygrid-day-top {
    padding: 5px;
  }

  .fc-event {
    font-size: 14px;
  }

  .fc .fc-col-header-cell {
    padding-top: 10px; /* 더 많은 공간을 주거나 줄입니다 */
    padding-bottom: 10px; /* 더 많은 공간을 주거나 줄입니다 */
  }
  
  .fc .fc-daygrid-day {
    height: 100px !important; /* 셀의 높이 조정 */
    border: 1px solid #ddd !important; /* 셀의 테두리 조정 */
`;
const CAL_P_01 = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.loading);
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const selectRecruit = () => {
    dispatch(setLoading());
    selectAllRecruits(
      date,
      (resp) => {
        if (resp.data.data) {
          setEvents(transformEventData(resp.data.data));
        }
        dispatch(unSetLoading());
      },
      (error) => {
        dispatch(unSetLoading());
      }
    );
  };

  // 달력 페이지 전환 시 API 호출
  const handleDatesSet = (arg) => {
    const currentStart = arg.view.currentStart;
    year = currentStart.getFullYear();
    month = currentStart.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함

    formattedMonth = month < 10 ? `0${month}` : `${month}`;
    date = year + "-" + formattedMonth + "-01";
    setEvents([]);
    selectRecruit();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    handleOpen();
  };

  const renderEventContent = (eventInfo) => {
    let Icon;
    switch (eventInfo.event.backgroundColor) {
      case "#ED544A":
        Icon = NotificationAddOutlinedIcon;
        break;
      case "#929292":
        Icon = NotificationsOffOutlinedIcon;
        break;
      default:
        Icon = null;
    }

    return (
      <div
        className="icon"
        style={{ padding: "3px", whiteSpace: "nowrap", textOverflow: "clip" }}
      >
        {Icon && <Icon style={{ marginRight: "4px", fontSize: "medium" }} />}
        <span className="event-title" style={{ overflow: "hidden" }}>
          {eventInfo.event.title}
        </span>
      </div>
    );
  };

  return (
    <PageContainer>
      <div style={{ marginBottom: "20px" }}>
        <div className="parent-container">
          <FullCalendarContainer>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              locale={koLocale}
              datesSet={handleDatesSet}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
            />
          </FullCalendarContainer>
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box sx={{ ...style, width: 600 }}>
            <CAL_M_01
              event={selectedEvent}
              imageUrl={imageUrl}
              onClose={handleClose}
            />
          </Box>
        </Modal>
      </div>
    </PageContainer>
  );
};

export default CAL_P_01;

import { Container, Paper, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";

import React from "react";
import CommonHeader from "../../components/Common/CommonHeader";
import Styles from "./CourseInfo.module.css";
import NoticeToggle from "./NoticeToggle/NoticeToggle";

import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NoteAddIcon from "@material-ui/icons/NoteAdd";

import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { Divider, Button } from "@material-ui/core";
import InsertCommentIcon from "@material-ui/icons/InsertComment";
import MovieFilterIcon from "@material-ui/icons/MovieFilter";
import ExtensionIcon from "@material-ui/icons/Extension";
import NoticeToggleRow from "./NoticeToggle/NoticeToggleRow/NoticeToggleRow";
import { BASE_URL } from "../../utils/apiEndpoints";
import { useHistory } from "react-router-dom";

import { dataLocalStorage, formatDate } from "../../utils/helpers";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    margin: "10px 0px",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const CourseInfo = () => {
  const [detailData, setDetailData] = useState("");
  const { courseId } = useParams();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const history = useHistory();
  const { _id, userName } = dataLocalStorage();
  const [notification, setNotification] = useState([]);
  const [isShowButtonExam, setIsShowButtonExam] = useState(false);

  useEffect(() => {
    Axios.get(`http://localhost:5000/get-course/${courseId}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("auth_token"),
      },
    })
      .then(async (result) => {
        if (result.status === 200) {
          setDetailData(result.data.course);
          ///
          const res = await Axios.get(
            `${BASE_URL}/show-all-notification-by-status/${result.data.course.app}`
          );
          if (res.status === 200) {
            setNotification(res.data.data);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // save to local storage
  }, []);

  useEffect(async () => {
    try {
      const data = await Axios.get(`/show-pdf-file/${courseId}`);
      if (data.status === 200) {
        setData(data.data.course);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(async () => {
    try {
      const data = await Axios.get(
        `/get-leader-private/${courseId}/${userName}`
      );
      if (data.data.data[0].score) {
        setIsShowButtonExam(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const converstDate = (date) => {
    const mydate = new Date(date);
    return mydate.toDateString();
  };

  const handleRedirect = (id) => {
    history.push(`/show-pdf/${id}`);
  };

  const redirectNewPage = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));

    window.open(
      `https://webroomcall.herokuapp.com/lobby.html?name=${data.userName}&room=${id}`,
      "_blank"
    );
  };

  const startExam = () => {
    history.push(`/quiz/${courseId}`);
  };
  console.log(data);

  return (
    <div>
      <CommonHeader title={detailData?.courseName} />
      <Container className="my-5">
        <Paper className="py-1 px-3 mb-5">
          <p
            style={{
              fontWeight: 800,
              color: "red",
              display: "inline-block",
              marginRight: "20px",
            }}
          >
            Thông báo :{" "}
            {notification[0]?.idTeacher && notification[0]?.idTeacher?.userName}
          </p>
          <span style={{ fontWeight: 900 }}>({notification[0]?.title})</span>
          <ul>
            {notification.length > 0 &&
              notification.map((e) => (
                <li
                  key={e._id}
                  style={{
                    borderBottom: "1px solid gray",
                    margin: "10px 0",
                    listStyle: "none",
                  }}
                  className="notification"
                >
                  <img
                    style={{ float: "right", padding: " 0 5px" }}
                    src="https://daotao.vku.udn.vn/public/images/new.gif"
                    alt=""
                  />
                  <span
                    style={{
                      float: "right",
                      fontSize: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    {formatDate(e.createdAt)}
                  </span>
                  <p>{e.description}</p>
                </li>
              ))}
          </ul>
        </Paper>
        <Paper className="px-5 py-3">
          {!isShowButtonExam && (
            <Button
              variant="outlined"
              startIcon={
                <img
                  src="https://daotao.vku.udn.vn/public/images/new.gif"
                  alt=""
                />
              }
              onClick={startExam}
            >
              Bắt đầu thi
            </Button>
          )}

          <div className="">
            <div className="d-flex justify-content-between align-items-center my-4">
              <Typography variant="h6">
                Link Room:{" "}
                <span
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => redirectNewPage(detailData?.courseRoom)}
                >
                  Click here
                </span>
              </Typography>
              <Typography style={{ color: "GrayText" }} variant="subtitle2">
                Course start date: {converstDate(detailData?.createdAt)}
              </Typography>
            </div>
            {/* <NoticeToggle /> */}
            <Accordion style={{ backgroundColor: "#EDEFF7" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>Description</Typography>
              </AccordionSummary>
              <Typography className="mx-3 my-2" variant="h6">
                {detailData?.courseName}
              </Typography>

              <AccordionDetails>
                <NoticeToggleRow
                  Icon={InsertCommentIcon}
                  title={detailData?.courseDescription}
                  description={detailData?.courseDetail}
                />
                <Divider />
              </AccordionDetails>
            </Accordion>
            {/* Bai Tap */}
            {data?.map((row, index) => (
              <Accordion key={index} style={{ backgroundColor: "#EDEFF7" }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>
                    {row.pdfTopic}
                  </Typography>
                </AccordionSummary>
                <Typography className="mx-3 my-2" variant="h6">
                  {row.pdfName}
                </Typography>

                <AccordionDetails>
                  <div>
                    <i className="fa-solid fa-book"></i>
                    <span
                      style={{
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={() => handleRedirect(row._id)}
                    >
                      {" "}
                      Open file
                    </span>
                  </div>
                  <Divider />
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default CourseInfo;

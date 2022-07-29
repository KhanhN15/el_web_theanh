import { Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AddCourse from "../Admin/Course/AddCourse/AddCourse";
import Styles from "./AdminCourseInfo.module.css";
import Axios from "axios";
import CourseInfoTable from "../Admin/Course/AddCourse/CourseInfoTable/CourseInfoTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseInfo } from "../../Redux/course/courseAction";

const TeacherCourseInfo = () => {
  const [data, setData] = useState([]);
  const [course, setCourse] = useState(false);
  const dispatch = useDispatch();
  const courseData = useSelector((state) => state.course.courseInfo);

  useEffect(() => {
    dispatch(fetchCourseInfo());
  }, []);
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <Container>
              <Paper>
                <Typography
                  className="text-center text-primary py-2"
                  variant="h4"
                >
                  Thông Tin Khóa Học
                </Typography>
              </Paper>
              <div className={Styles.add__course}>
                <AddCourse course={course} setCourse={setCourse} />
              </div>
            </Container>
            {course ? (
              <Container>
                <Row>
                  <CourseInfoTable course={course} setCourse={setCourse} />
                </Row>
              </Container>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default TeacherCourseInfo;

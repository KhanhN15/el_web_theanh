import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseInfo } from "../../../Redux/course/courseAction";
import { Col, Container, Row } from "react-bootstrap";
import Spinner_comp from "../../../components/Spinner/Spinner_comp";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  media: {
    height: 200,
    objectFit: "cover",
  },
});
const CardOfAllCourse = () => {
  const classes = useStyles();
  const [enroll, setEnroll] = useState(false);
  const history = useHistory();

  const { courseInfo } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchCourseInfo());
  }, []);
  const enrollHandler = (id) => {
    history.push(`/detail-courses/${id}`);
  };

  const redirectNewPage = (id) => {
    const data = JSON.parse(localStorage.getItem("user"));

    window.open(
      `https://webroomcall.herokuapp.com/lobby.html?name=${data.userName}&room=${id}`,
      "_blank"
    );
  };

  return (
    <Container>
      <Row className="g-4">
        {courseInfo.length > 0 ? (
          courseInfo.map((val) => {
            return (
              <Col key={val._id} className="g-4" md={4}>
                <Card className="m-3">
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={val.courseThumbnail}
                      title="Contemplative Reptile"
                    />
                    <CardContent>
                      <span
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                          color: "red",
                        }}
                        onClick={() => redirectNewPage(val.courseRoom)}
                      >
                        Link Phòng học
                      </span>
                      <Typography gutterBottom variant="h5" component="h2">
                        {val.courseName}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        {val.courseDescription}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActionArea
                    className="p-2"
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <Button
                      onClick={() => enrollHandler(val._id)}
                      variant="contained"
                      color="primary"
                    >
                      Show
                    </Button>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {val.student.length} Student Join
                    </Typography>
                  </CardActionArea>
                </Card>
              </Col>
            );
          })
        ) : (
          <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Spinner_comp />
          </div>
        )}
      </Row>
    </Container>
  );
};

export default CardOfAllCourse;

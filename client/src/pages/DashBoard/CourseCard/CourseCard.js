import { Button, Divider } from "@material-ui/core";
import { useState } from "react";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import Styles from "./CourseCard.module.css";
import LazyLoad from "react-lazyload";
import axios from "axios";
import { BASE_URL } from "../../../utils/apiEndpoints";
import Toast_Comp from "../../../components/Toast/Toast_Comp";

const CourseCard = ({ title, name, id, img }) => {
  const history = useHistory();
  const [toast, setToast] = useState(false);

  const handleRedirectPage = () => {
    history.push(`/course/${id}`);
  };

  const data = JSON.parse(localStorage.getItem("user"));

  const handleJoinGroup = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/add-student`, {
        idCourse: id,
        listIdStudent: data._id,
      });
      if (res.status === 200) {
        setToast(true);
        handleRedirectPage();
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <LazyLoad height={200} offset={100} once={true}>
      <Toast_Comp
        setToast={setToast}
        renderToast={toast}
        msg="Join Class Success"
      />
      <div className={Styles.course__Card}>
        <Link to={`#`} className={Styles.container}>
          <img className={Styles.image} src={img} alt="" />
          <div className={Styles.overlay}>
            <p className={Styles.text}>View</p>
          </div>
        </Link>

        <div className={Styles.course__content}>
          <h3>{name}</h3>
          <h5>{title}</h5>
          <Button
            variant="outlined"
            style={{ marginLeft: "10px" }}
            color="primary"
            onClick={handleJoinGroup}
          >
            Join
          </Button>
          <br />
        </div>
      </div>
      <Divider />
    </LazyLoad>
  );
};

export default CourseCard;

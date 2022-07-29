import React from "react";
import winner from "./Winners.gif";
import { useHistory, useParams } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { dataLocalStorage } from "../../utils/helpers";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { useState, useEffect } from "react";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

const QuizResult = () => {
  const { userName } = dataLocalStorage();
  const history = useHistory();
  const { courseId } = useParams();
  const [count, setCount] = useState(0);

  useEffect(async () => {
    try {
      const data = await axios.get(
        `/get-leader-private/${courseId}/${userName}`
      );
      if (data.status === 200) {
        setCount(data.data.data[0].score);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const routerChange = () => {
    history.push("/");
  };
  return (
    <div className="result">
      <div className="d-flex align-items-center justify-content-center"></div>
      <div className="result_card">
        <div className="d-flex justify-content-center align-items-center">
          <div className="res_head center">
            <h3 style={{ margin: "0px" }}>Kết quả của bạn</h3>
          </div>

          <div className="result_card_header">
            {count >= 4 ? (
              <img src={winner} className="result_gif" alt="winner_gif" />
            ) : (
              <SentimentVeryDissatisfiedIcon
                style={{ color: "rgb(252, 196, 11)" }}
              />
            )}
          </div>
        </div>

        <div className="result_card_body">
          <div className="result_uname center w-40">
            <h6>{userName}</h6>
          </div>
          <div className="result_Bar center">
            <CircularProgressbar
              className="bar_prog"
              value={count}
              maxValue={5}
              text={`${count}/5`}
              styles={buildStyles({
                // Rotation of path and trail, in number of turns (0-1)
                rotation: 0.25,

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "butt",

                // Text size
                textSize: "30px",

                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 0.5,

                // Can specify path transition in more detail, or remove it entirely
                // pathTransition: 'none',

                // Colors
                pathColor: `${count > 3 ? "#5eff86" : "red"}`,
                textColor: `${count > 3 ? "#5eff86" : "red"}`,
                trailColor: "#d6d6d6",
                backgroundColor: "#3e98c7",
              })}
            />
          </div>
          <button
            onClick={routerChange}
            className="res_btns d-flex align-items-center justify-content-center"
          >
            Quay Lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;

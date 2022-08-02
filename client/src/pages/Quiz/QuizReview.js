import { useState, useEffect } from "react";
import axios from "axios";
import { WhisperSpinner } from "react-spinners-kit";
import { useParams } from "react-router-dom";
import { dataLocalStorage } from "../../utils/helpers";
import DoneIcon from "@material-ui/icons/Done";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";

const QuizReview = () => {
  const [correctAnsw, setCorrectAnsw] = useState([]);
  const [userAnsw, setUserAnsw] = useState([]);
  const [quizzes, SetQuizzes] = useState([]);
  const { courseId } = useParams();
  const { userName } = dataLocalStorage();
  const [count, setCount] = useState(0);
  const history = useHistory();

  async function fetchQuestion() {
    try {
      const questions = await axios.get(`/get-quiz/${courseId}`);
      const quizArray = questions.data.data;
      let arrayCorrectA = [];
      quizArray.forEach((element) => {
        arrayCorrectA.push(element.correct_answer);
      });
      setCorrectAnsw(arrayCorrectA);
      SetQuizzes(quizArray);
    } catch (e) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, []);

  useEffect(async () => {
    try {
      const data = await axios.get(
        `/get-leader-private/${courseId}/${userName}`
      );
      if (data.data.data[0].score) {
        setCount(data.data.data[0].score);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkSubmit = (value) => {
    let checkCorrectA = correctAnsw.find((el) => el === value);
    if (checkCorrectA) {
      return <DoneIcon style={{ color: "green" }} />;
    } else {
      return <CloseIcon style={{ color: "red" }} />;
    }
    return "";
  };

  console.log("====================================");
  console.log(quizzes);
  console.log("====================================");

  return (
    <div className="quiz_view d-flex justify-content-center">
      <div className="quiz-container">
        <span
          style={{
            float: "right",
            color: "red",
          }}
        >
          Câu đúng : {count}/{quizzes?.length}
        </span>
        <div>
          <p className="author">Tác giả : {userName} </p>
          <h1>Kì Thi</h1>
          <div className="question_card">
            {quizzes.length > 0 ? (
              quizzes.map((row, index) => (
                <div key={row._id}>
                  <h5>
                    {row.question} :
                    {row.difficulty ? (
                      <span style={{ color: "red", fontSize: "10px" }}>
                        (Nâng cao)*
                      </span>
                    ) : (
                      ""
                    )}
                  </h5>
                  <div className="answer_sec">
                    {row.answers.map((item, s) => {
                      return (
                        <div className="answers" key={s}>
                          <span style={{ margin: "0 10px", display: "block" }}>
                            {item}
                          </span>
                          {checkSubmit(item)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex justify-content-center align-items-center loader_spinner">
                <WhisperSpinner size={30} color="#5eff86" loading={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizReview;

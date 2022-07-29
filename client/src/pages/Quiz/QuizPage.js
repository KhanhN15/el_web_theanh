import { useState, useEffect } from "react";
import axios from "axios";
import { WhisperSpinner } from "react-spinners-kit";
import { useParams } from "react-router-dom";
import { dataLocalStorage } from "../../utils/helpers";
import DoneIcon from "@material-ui/icons/Done";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";

const QuizPage = () => {
  const [correctAnsw, setCorrectAnsw] = useState([]);
  const [userAnsw, setUserAnsw] = useState([]);
  const [quizzes, SetQuizzes] = useState([]);
  const { courseId } = useParams();
  const { userName } = dataLocalStorage();
  const [isSubmit, setIsSubmit] = useState(false);
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

  async function quizSubmit(e) {
    e.preventDefault();
    if (userAnsw.length < quizzes.length) {
      alert("Vui long dien het cac cau tra loi");
      return;
    }
    setIsSubmit(true);
    let marks = 0;
    for (let i = 0; i < userAnsw.length; i++) {
      if (userAnsw[i][`item${i}`] === correctAnsw[i]) {
        marks = marks + 1;
      }
    }
    const result = await axios.post(`/post-leader`, {
      name: userName,
      typeCourse: courseId,
      score: marks,
      date: Date.now(),
    });
    history.push(`/quiz/${courseId}/results`);
  }

  const handleAnswer = (index, e) => {
    const checkIndex = userAnsw.find((el) =>
      el.hasOwnProperty([`item${index}`])
    );
    if (!checkIndex) {
      setUserAnsw([
        ...userAnsw,
        {
          [`item${index}`]: e.target.value,
        },
      ]);
    } else {
      let person = userAnsw.filter(
        (person) => person[`item${index}`] !== checkIndex[`item${index}`]
      );
      setUserAnsw([
        ...person,
        {
          [`item${index}`]: e.target.value,
        },
      ]);
    }
  };

  const checkHere = (index, value) => {
    let check = userAnsw.find((el) => el.hasOwnProperty([`item${index}`]));
    if (check && check[`item${index}`] === value) {
      return <RadioButtonCheckedIcon style={{ color: "green" }} />;
    } else {
      return "";
    }
    return "";
  };

  const checkSubmit = (value) => {
    let checkCorrectA = correctAnsw.find((el) => el === value);
    if (checkCorrectA) {
      return <DoneIcon style={{ color: "green" }} />;
    } else {
      return <CloseIcon style={{ color: "red" }} />;
    }
    return "";
  };

  return (
    <div className="quiz_view d-flex justify-content-center">
      <div className="quiz-container">
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
                  <div
                    className="answer_sec"
                    onChange={(e) => handleAnswer(index, e)}
                  >
                    {row.answers.map((item, s) => {
                      return (
                        <div className="answers" key={s}>
                          <input type="radio" name="one" value={item} />
                          <span style={{ margin: "0 10px", display: "block" }}>
                            {item}
                          </span>
                          {isSubmit
                            ? checkSubmit(item)
                            : checkHere(index, item)}
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
        <div className="d-flex justify-content-center align-items-center">
          {!isSubmit && (
            <button
              type="submit"
              className="quizsubmit"
              onClick={(e) => quizSubmit(e)}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;

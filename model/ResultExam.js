const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    typeCourse: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    correct_answer: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
    question_choose: {
      type: String,
      required: true,
    },
    point: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ResultExamModel = mongoose.model("ResultExam", courseSchema);

module.exports = ResultExamModel;

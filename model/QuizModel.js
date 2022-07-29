const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    typeCourse: {
      type: String,
      required: true,
    },
    isStart: {
      type: Boolean,
      required: true,
    },
    difficulty: {
      type: Boolean,
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
  },
  {
    timestamps: true,
  }
);

const QuizModel = mongoose.model("Quiz", courseSchema);

module.exports = QuizModel;

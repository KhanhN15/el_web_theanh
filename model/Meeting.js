const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    typeCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
    userJoin: {
      type: Array,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MeetingModel = mongoose.model("Meeting", courseSchema);

module.exports = MeetingModel;

const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    pdfTopic: {
      type: String,
      required: true,
    },
    pdfName: {
      type: String,
      required: true,
    },

    pdfFile: {
      type: String,
      required: true,
    },
    idCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const PdfModel = mongoose.model("Pdf", courseSchema);

module.exports = PdfModel;

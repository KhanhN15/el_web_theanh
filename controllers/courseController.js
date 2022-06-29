const CourseModel = require("../model/CourseModel");
const PdfModel = require("../model/PdfModel");
const cloudinary = require("../middlewares/cloudinary");
const mongoose = require("mongoose");

module.exports.postCourse__controller = async (req, res, next) => {
  try {
    console.log(req.body);
    const { courseDescription, courseName, courseRoom, courseDetail } =
      req.body;

    if (
      !courseDescription ||
      !courseName ||
      !courseDetail ||
      !courseRoom ||
      !req.file
    ) {
      return res.status(400).json({
        error: "Please Provide All Information",
      });
    }

    const pic = await cloudinary.uploader.upload(req.file.path);
    //console.log(pic.secure_url)

    //const url = req.protocol + "://" + req.get("host");

    const course = new CourseModel({
      courseName,
      courseDescription,
      courseThumbnail: pic.secure_url,
      courseRoom,
      courseDetail,
      app: req.user._id,
    });
    course
      .save()
      .then((result) => {
        //console.log(result)
        return res.status(200).json({
          result,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({
          error: "Something went wrong",
        });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.getCourses__controller = async (req, res, next) => {
  try {
    const courses = await CourseModel.find().populate(
      "app",
      "role _id userName email"
    );
    return res.status(200).json({
      courses,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.getOneCourse__controller = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const course = await CourseModel.findOne({ _id: courseId }).populate(
      "student",
      "role _id userName email"
    );
    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.deleteCourse__Controller = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    console.log(courseId);
    const course = await CourseModel.findOneAndDelete({ _id: courseId });
    return res.status(200).json({
      course,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.addStudent = async (req, res, next) => {
  try {
    const { idCourse, listIdStudent } = req.body;
    const _ids = mongoose.Types.ObjectId(idCourse);
    // const array = JSON.parse(listIdStudent);

    if (_ids) {
      // get data before
      const beforeCourse = await CourseModel.find({ _id: _ids });

      const beforeArray = beforeCourse[0].student;
      let newArray = [];
      if (beforeArray && beforeArray.length > 0) {
        newArray = [...beforeArray];
        if (!newArray.includes(listIdStudent)) {
          newArray.push(listIdStudent);
        }
      } else {
        newArray.push(listIdStudent);
      }

      const course = await CourseModel.findOneAndUpdate(
        { _id: _ids },
        { student: newArray },
        function (err, result) {
          if (err) {
            return res.status(400).json({
              mess: "fails",
            });
          } else {
            return res.status(200).json({
              mess: "success",
            });
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllStudent = async (req, res, next) => {
  try {
    const courses = await CourseModel.find().select([
      "-courseDescription",
      "-courseThumbnail",
    ]);
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllById = async (req, res, next) => {
  try {
    let reqParam = req.query.data;

    for (let item of reqParam) {
      const course = await CourseModel.findOne({ _id: item });
      console.log(item);
    }
  } catch (error) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.addPdf = async (req, res, next) => {
  try {
    const { pdfName, pdfTopic, pdfFile, idCourse } = req.body;
    const productExist = await PdfModel.findOne({ pdfName });
    if (productExist) {
      return res.status(400).json({
        error: "fails",
      });
    } else {
      const pdf = new PdfModel({
        pdfTopic,
        pdfName,
        pdfFile,
        idCourse,
      });
      if (pdf) {
        const create = await pdf.save();
        return res.status(200).json({
          mess: "Success",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllPdf = async (req, res, next) => {
  try {
    const courses = await PdfModel.find();
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllPdfById = async (req, res, next) => {
  try {
    const courses = await PdfModel.findById(req.params.id).populate("idCourse");
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllPdfByIdCourse = async (req, res, next) => {
  try {
    const courses = await PdfModel.findById(req.params.id);
    return res.status(200).json({
      courses,
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.deletePdfById = async (req, res, next) => {
  try {
    const pdf = await PdfModel.findById(req.params.id);
    if (pdf) {
      await pdf.remove();
      return res.status(200).json({
        mess: "Success",
      });
    } else {
      return res.status(400).json({
        mess: "Fails",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.putPdfById = async (req, res, next) => {
  try {
    const { pdfName, pdfTopic, pdfFile, idCourse, idUpdate } = req.body;

    const pdf = await PdfModel.findById(idUpdate);
    if (pdf) {
      pdf.pdfName = pdfName || pdf.pdfName;
      pdf.pdfTopic = pdfTopic || pdf.pdfTopic;
      pdf.pdfFile = pdfFile || pdf.pdfFile;
      pdf.idCourse = idCourse || pdf.idCourse;
      const updatedProduct = await pdf.save();
      return res.status(200).json({
        mess: "Success",
      });
    } else {
      return res.status(400).json({
        error: "Not Found",
      });
    }

    const productExist = await PdfModel.findOne({ pdfName });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

const CourseModel = require("../model/CourseModel");
const PdfModel = require("../model/PdfModel");
const NotificationModel = require("../model/NotificationModel");
const cloudinary = require("../middlewares/cloudinary");
const mongoose = require("mongoose");
const UserModel = require("../model/UserModel");
const QuizModel = require("../model/QuizModel");
const LeadBoardModel = require("../model/LeadBoardModel");

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
    const courses = await PdfModel.find().populate(
      "idTeacher",
      "role _id userName email"
    );
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

module.exports.createNotification = async (req, res, next) => {
  try {
    const { idTeacher, title, description } = req.body;
    const notify = new NotificationModel({
      title,
      description,
      idTeacher,
    });
    if (notify) {
      const create = await notify.save();
      return res.status(200).json({
        mess: "Success",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllNotificationById = async (req, res, next) => {
  try {
    const data = await NotificationModel.find().populate(
      "idTeacher",
      "role userName email"
    );
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showNotificationById = async (req, res, next) => {
  try {
    const data = await NotificationModel.findById(req.params.id).populate(
      "idTeacher",
      "role userName email"
    );
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.putNotificationById = async (req, res, next) => {
  try {
    const { idNotification, title, description, idTeacher } = req.body;
    const notify = await NotificationModel.findById(idNotification);

    if (notify) {
      notify.title = title || notify.title;
      notify.description = description || notify.description;
      notify.idTeacher = idTeacher || notify.idTeacher;
      const updatedProduct = await notify.save();
      return res.status(200).json({
        mess: "Success",
      });
    } else {
      return res.status(400).json({
        error: "Not Found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.deleteNotification = async (req, res, next) => {
  try {
    const pdf = await NotificationModel.findById(req.params.id);
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

module.exports.updateStatusNotification = async (req, res, next) => {
  try {
    const { idNotification, isShow } = req.body;
    const notify = await NotificationModel.findById(idNotification);

    if (notify) {
      notify.isShow = isShow;
      const updatedProduct = await notify.save();
      return res.status(200).json({
        mess: "Success",
      });
    } else {
      return res.status(400).json({
        error: "Not Found",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showAllNotificationByStatus = async (req, res, next) => {
  try {
    const { _id } = await UserModel.findById(req.params.id);

    const data = await NotificationModel.find({
      isShow: true,
      idTeacher: mongoose.Types.ObjectId(_id),
    }).populate("idTeacher", "role userName email");
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.showNotificationStatusById = async (req, res, next) => {
  try {
    const { _id } = await UserModel.findById(req.params.id);

    const data = await NotificationModel.find({
      idTeacher: mongoose.Types.ObjectId(_id),
    }).populate("idTeacher", "role userName email");
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};
const limitrecords = 10;
module.exports.getQuiz = async (req, res, next) => {
  try {
    const data = await QuizModel.find({ typeCourse: req.params.id }).limit(10);
    return res.status(200).json({
      data: data || [],
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

function getRandomArbitrary(min, max) {
  return Math.ceil(Math.random() * (max - min) + min);
}

module.exports.postQuiz = async (req, res, next) => {
  try {
    const quizData = new QuizModel(req.body);
    quizData.save((err) => {
      if (err) {
        return res.status(400).json({
          mess: "Error",
        });
      } else {
        return res.status(200).json({
          mess: "Success",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.getLeader = async (req, res, next) => {
  try {
    const data = await LeadBoardModel.find();
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.getLeaderPrivate = async (req, res, next) => {
  try {
    const data = await LeadBoardModel.find({
      typeCourse: req.params.id,
      name: req.params.name,
    });
    if (data) {
      return res.status(200).json({
        data,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.postLeader = async (req, res, next) => {
  try {
    const leaderBoard = new LeadBoardModel(req.body);
    leaderBoard.save((err) => {
      if (err) {
        return res.status(400).json({
          mess: "Error",
        });
      } else {
        return res.status(200).json({
          mess: "Success",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.deleteQuiz = async (req, res, next) => {
  try {
    const checkId = await QuizModel.findById(req.params.id);
    if (checkId) {
      await checkId.remove();
      return res.status(200).json({
        mess: "Success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.findQuizById = async (req, res, next) => {
  try {
    const checkId = await QuizModel.findById(req.params.id);
    if (checkId) {
      return res.status(200).json({
        data: checkId,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

module.exports.updateQuiz = async (req, res, next) => {
  try {
    const {
      idEdit,
      category,
      typeCourse,
      isStart,
      difficulty,
      question,
      correct_answer,
      answers,
    } = req.body;

    const quiz = await QuizModel.findById(idEdit);

    if (quiz) {
      quiz.category = category || quiz.category;
      quiz.typeCourse = typeCourse || quiz.typeCourse;
      quiz.isStart = isStart || quiz.isStart;
      quiz.difficulty = difficulty || quiz.difficulty;
      quiz.question = question || quiz.question;
      quiz.correct_answer = correct_answer || quiz.correct_answer;
      quiz.answers = answers || quiz.answers;
      const updatedProduct = await quiz.save();

      return res.status(200).json({
        mess: "success",
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

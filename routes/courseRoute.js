const {
  postCourse__controller,
  getCourses__controller,
  getOneCourse__controller,
  deleteCourse__Controller,
  addStudent,
  showAllStudent,
  showAllById,
  addPdf,
  showAllPdf,
  showAllPdfById,
  deletePdfById,
  putPdfById,
  showAllPdfByIdCourse,
  createNotification,
  showAllNotificationById,
  showNotificationById,
  putNotificationById,
  deleteNotification,
  updateStatusNotification,
  showAllNotificationByStatus,
  showNotificationStatusById,
  getQuiz,
  postQuiz,
  getLeader,
  postLeader,
  deleteQuiz,
  findQuizById,
  updateQuiz,
  getLeaderPrivate,
} = require("../controllers/courseController");
const { adminAuthentication } = require("../middlewares/authentication");
const { requireLogin } = require("../middlewares/requireLogin");

const router = require("express").Router();
const upload = require("../middlewares/multer");

router.post(
  "/post-course",
  requireLogin,
  upload.single("img"),
  postCourse__controller
);

router.get("/get-courses", requireLogin, getCourses__controller);

router.get("/get-course/:courseId", getOneCourse__controller);

router.delete("/delete", requireLogin, deleteCourse__Controller);

router.post("/add-student", addStudent);
router.get("/show-student", showAllStudent);
router.get("/show-all-id", showAllById);
router.post("/add-pdf", addPdf);
router.get("/show-all-pdf", showAllPdf);
router.get("/show-all-pdf/:id", showAllPdfById);
router.get("/show-all-pdf-course/:id", showAllPdfByIdCourse);
router.delete("/delete/:id", deletePdfById);
router.put("/edit", putPdfById);

// notification
router.post("/create-notification", createNotification);
router.get("/show-all-notification", showAllNotificationById);
router.get("/show-notification/:id", showNotificationById);
router.put("/edit-notification", putNotificationById);
router.delete("/delete-notification/:id", deleteNotification);
router.put("/update-status-notification", updateStatusNotification);
router.get("/show-all-notification-by-status/:id", showAllNotificationByStatus);

router.get("/show-notification-status/:id", showNotificationStatusById);

// quiz game

router.get("/get-quiz/:id", getQuiz);
router.post("/post-quiz", postQuiz);
router.put("/update-quiz", updateQuiz);
router.get("/get-leader", getLeader);
router.get("/get-leader-private/:id/:name", getLeaderPrivate);
router.post("/post-leader", postLeader);
router.delete("/delete-quiz/:id", deleteQuiz);
router.get("/find-by-id-quiz/:id", findQuizById);

module.exports = router;

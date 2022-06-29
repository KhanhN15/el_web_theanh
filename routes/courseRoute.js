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
} = require("../controllers/courseController");
const { adminAuthentication } = require("../middlewares/authentication");
const { requireLogin } = require("../middlewares/requireLogin");

const router = require("express").Router();
const upload = require("../middlewares/multer");

router.post(
  "/post-course",
  requireLogin,
  adminAuthentication,
  upload.single("img"),
  postCourse__controller
);

router.get("/get-courses", requireLogin, getCourses__controller);

router.get("/get-course/:courseId", getOneCourse__controller);

router.delete(
  "/delete",
  requireLogin,
  adminAuthentication,
  deleteCourse__Controller
);

router.post("/add-student", addStudent);
router.get("/show-student", showAllStudent);
router.get("/show-all-id", showAllById);
router.post("/add-pdf", addPdf);
router.get("/show-all-pdf", showAllPdf);
router.get("/show-all-pdf/:id", showAllPdfById);
router.get("/show-all-pdf-course/:id", showAllPdfByIdCourse);
router.delete("/delete/:id", deletePdfById);
router.put("/edit", putPdfById);

module.exports = router;

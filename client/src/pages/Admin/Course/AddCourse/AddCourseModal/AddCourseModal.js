import { Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import Axios from "axios";
import Toast_Comp from "../../../../../components/Toast/Toast_Comp";
import Spinner_comp from "../../../../../components/Spinner/Spinner_comp";
import "./AddCourseModal.css";
import { useDispatch } from "react-redux";
import { fetchCourseInfo } from "../../../../../Redux/course/courseAction";

const AddCourseModal = () => {
  const [show, setShow] = useState(false);
  const [lgShow, setLgShow] = useState(false);
  const [courseThumbnail, setCourseThumbnail] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [courseName, setCourseName] = useState("");
  const [codeRoom, setCodeRooms] = useState("");
  const [detailData, setDetailData] = useState("");
  const [imgLabel, setImgLabel] = useState("Choose photo");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setImgLabel(courseThumbnail.name);
  }, [courseThumbnail]);

  const courseFormHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("courseDescription", courseDescription);
    formData.append("img", courseThumbnail);
    formData.append("courseRoom", codeRoom);
    formData.append("courseDetail", detailData);

    fetch("/post-course", {
      body: formData,
      method: "post",
      headers: {
        authorization: "Bearer " + localStorage.getItem("auth_token"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setToast(true);
        setLoading(false);
        setCourseDescription("");
        setCourseName("");
        setCodeRooms("");
        setCourseThumbnail("");
        setDetailData("");
        dispatch(fetchCourseInfo());
        dispatch({ type: "UPDATE__COURSE__LIST", payload: true });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeCode = (e) => {
    let str = e.target.value;

    setCodeRooms(slug(str));
  };

  const slug = function (str) {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
    var to = "aaaaaeeeeeiiiiooooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleShow}>
        Thêm Khóa Học
      </Button>

      <Toast_Comp
        setToast={setToast}
        renderToast={toast}
        msg="Course Uploaded Successfully"
      />

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        show={show}
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography color="textSecondary" variant="h4">
              Thêm Khóa Học
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && <Spinner_comp />}

          <Form onSubmit={courseFormHandler} encType="multipart/form-data">
            <Form.Group>
              <Form.Label>Tên Lớp Học</Form.Label>
              <Form.Control
                required
                onChange={(e) => setCourseName(e.target.value)}
                value={courseName}
                type="text"
                placeholder="Nhập tên lớp học"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mô tả Lớp Hoc</Form.Label>

              <Form.Control
                required
                onChange={(e) => setCourseDescription(e.target.value)}
                value={courseDescription}
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả lớp học"
              />
            </Form.Group>
            <Form.Group className="input__file">
              <label>Ảnh mô tả</label>
              <br />
              <Form.File
                required
                type="file"
                filename="img"
                onChange={(e) => setCourseThumbnail(e.target.files[0])}
                id="custom-file"
                custom
                label={imgLabel ? `${imgLabel}` : "Choose photo"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Mã phòng*{" "}
                <p style={{ color: "red", display: "inline" }}>
                  Không được chứa các kí tự đặc biệt
                </p>
              </Form.Label>

              <Form.Control
                required
                onChange={(e) => handleChangeCode(e)}
                value={codeRoom}
                type="text"
                placeholder="Nhập mã code"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Chi tiết </Form.Label>

              <Form.Control
                required
                onChange={(e) => setDetailData(e.target.value)}
                value={detailData}
                as="textarea"
                rows={3}
                placeholder="Nhập chi tiết"
              />
            </Form.Group>
            <Button type="submit" color="primary" variant="contained">
              Xác nhận
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" variant="contained" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCourseModal;

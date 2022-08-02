import { Container } from "@material-ui/core";
import { Avatar, Paper, Typography } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { Suspense } from "react";
import TableDetail from "./TableDetail";
import { useParams } from "react-router";
import { BASE_URL } from "../../utils/apiEndpoints";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {
  Box,
  Card,
  IconButton,
  TableFooter,
  TablePagination,
  CircularProgress,
} from "@material-ui/core";
import Axios from "axios";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useState, useEffect } from "react";
import axios from "axios";
import Toast_Comp from "../../components/Toast/Toast_Comp";
import { useHistory } from "react-router";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  root: {
    height: "100%",
    paddingTop: "30px",
  },
});

const DetailCourse = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [toast, setToast] = useState(false);
  const [type, setType] = useState("success");
  const [listPdf, setListPdf] = useState([]);
  const [showButtonEdit, setShowButtonEdit] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const history = useHistory();

  useEffect(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/get-course/${id}`);
      if (res.status === 200) {
        setData(res.data.course.student);
      }
      const ress = await axios.get(`${BASE_URL}/show-pdf-file/${id}`);
      if (ress.status === 200) {
        setIsLoadingPdf(true);
        setListPdf(ress.data.course);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingPdf(false);
    }
  }, [toast]);

  const fileType = ["application/pdf"];
  const handlePdf = async (e) => {
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileType.includes(selectedFile.type)) {
        let reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = (e) => {
          setFile(e.target.result);
        };
      } else {
        setPdfFile(null);
      }
    } else {
      console.log("select your file");
    }
  };

  const handleSubmitForm = async () => {
    if (!file || !name || !topic) {
      alert("Khong duoc de trong");
    } else {
      try {
        const res = await axios.post(`/add-pdf`, {
          pdfTopic: topic,
          pdfName: name,
          pdfFile: file,
          idCourse: id,
        });
        if (res.status === 200) {
          setToast(true);
          setFile("");
          setTopic("");
          setName("");
          setShowButtonEdit(false);
        }
      } catch (error) {
        alert("File Has Exist");
      }
    }
  };

  const converstDate = (date) => {
    const mydate = new Date(date);
    return mydate.toDateString();
  };

  const handleDeleteItem = async (id) => {
    try {
      const ress = await axios.delete(`${BASE_URL}/delete/${id}`);
      if (ress.status === 200) {
        setToast(true);
      }
    } catch (error) {
      alert("Delete Fails");
    }
  };

  const handleUpdateForm = async () => {
    if (!file || !name || !topic) {
      alert("Khong duoc de trong");
    } else {
      try {
        const res = await axios.put(`/edit`, {
          pdfTopic: topic,
          pdfName: name,
          pdfFile: file,
          idCourse: id,
          idUpdate: idUpdate,
        });
        if (res.status === 200) {
          setToast(true);
          setFile("");
          setTopic("");
          setName("");
          setShowButtonEdit(false);
        }
      } catch (error) {
        alert("File Has Exist");
      }
    }
  };

  const handleEditItem = async (id) => {
    try {
      setShowButtonEdit(true);
      const ress = await axios.get(`${BASE_URL}/show-all-pdf/${id}`);
      if (ress.status === 200) {
        const { pdfFile, pdfName, pdfTopic, _id } = ress.data.courses;
        setFile(pdfFile);
        setName(pdfName);
        setTopic(pdfTopic);
        setIdUpdate(_id);
      }
    } catch (error) {
      alert("Delete Fails");
    }
  };

  const handleRouter = () => {
    history.push(`/admin-quiz/${id}`);
  };

  return (
    <div>
      <Container>
        <Toast_Comp
          setToast={setToast}
          renderToast={toast}
          msg=" Success"
          type={type}
        />
        <Typography
          className="text-center my-3 border-bottom"
          variant="h3"
          color="primary"
        >
          Chi tiết khóa học
        </Typography>
        <Suspense fallback={<div>Loading...</div>}>
          <Container fluid className="mb-5">
            <Row>
              <Col md={6}>
                <Button
                  variant="outlined"
                  onClick={handleRouter}
                  startIcon={<ControlPointIcon />}
                >
                  Tổ Chức Thi
                </Button>
                <Paper className="p-5 m-3 shadow">
                  <Typography
                    className="text-center font-weight-bold pb-4"
                    variant="h5"
                  >
                    Danh sách học sinh
                  </Typography>
                  <Container className={classes.root}>
                    <TableContainer component={Paper}>
                      <Table
                        className={classes.table}
                        aria-label="simple table"
                      >
                        <TableHead>
                          <TableRow className="bg-dark ">
                            <TableCell align="center" className="text-light">
                              Tên học sinh
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.map((row) => (
                            <TableRow key={row._id}>
                              <TableCell align="center">
                                {row.userName}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Container>
                  <Typography
                    className="text-center font-weight-bold py-4"
                    variant="h5"
                  >
                    Danh Sách Tài Liệu
                  </Typography>
                  {/* here */}
                  {isLoadingPdf ? (
                    <CircularProgress className="text-center" />
                  ) : (
                    listPdf.length > 0 &&
                    listPdf?.map((e, index) => (
                      <div key={index}>
                        <h3>{e.pdfTopic}</h3>
                        <div className="document">
                          <i
                            className="fa-solid fa-book"
                            style={{
                              color: "#6d6dc2",
                            }}
                          ></i>
                          <p>{e.pdfName}</p>
                          <p className="title_doc">
                            {converstDate(e.createdAt)}
                          </p>
                          <Button
                            variant="outlined"
                            style={{ fontSize: "10px", marginRight: "10px" }}
                            onClick={() => handleEditItem(e._id)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            style={{ fontSize: "10px" }}
                            onClick={() => handleDeleteItem(e._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </Paper>
              </Col>
              <Col md={6}>
                <Paper className="p-5 m-3 shadow">
                  <div className="row mb-4">
                    <div className="col-xl-8 col-lg-8">
                      <div className="">
                        <div className="card-body">
                          <div className="mb-4">
                            <label
                              htmlFor="product_title"
                              className="form-label"
                            >
                              Chủ đề
                            </label>
                            <input
                              type="text"
                              placeholder="Type here"
                              className="form-control"
                              id="product_title"
                              onChange={(e) => setTopic(e.target.value)}
                              required
                              value={topic}
                            />
                          </div>
                          <div className="mb-4">
                            <label
                              htmlFor="product_title"
                              className="form-label"
                            >
                              Tên Tài Liệu
                            </label>
                            <input
                              type="text"
                              placeholder="Type here"
                              className="form-control"
                              id="product_title"
                              onChange={(e) => setName(e.target.value)}
                              required
                              value={name}
                            />
                          </div>
                          <div className="mb-4">
                            <label className="form-label">
                              Tài liệu{" "}
                              <p
                                style={{
                                  color: "red",
                                  display: "inline-block",
                                }}
                              >
                                ( Nhận mỗi file PDF)
                              </p>{" "}
                            </label>
                            <Button
                              variant="outlined"
                              component="label"
                              onChange={(e) => handlePdf(e)}
                            >
                              Upload File
                              <input
                                type="file"
                                accept="application/pdf"
                                hidden
                              />
                            </Button>
                            {showButtonEdit ? (
                              <Button
                                variant="contained"
                                style={{ marginLeft: "10px" }}
                                onClick={handleUpdateForm}
                              >
                                Update
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                style={{ marginLeft: "10px" }}
                                onClick={handleSubmitForm}
                              >
                                Submit
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Paper>
              </Col>
            </Row>
          </Container>
        </Suspense>
      </Container>
    </div>
  );
};

export default DetailCourse;

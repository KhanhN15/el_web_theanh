import { Container } from "@material-ui/core";
import { Avatar, Paper, Typography } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { Suspense } from "react";
import TableDetail from "../DetailCourse/TableDetail";
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
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useState, useEffect } from "react";
import axios from "axios";
import Toast_Comp from "../../components/Toast/Toast_Comp";
import { dataLocalStorage } from "../../utils/helpers";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  root: {
    height: "100%",
    paddingTop: "30px",
  },
});

const TeacherNotification = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [file, setFile] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [toast, setToast] = useState(false);
  const [type, setType] = useState("success");
  const [listNotification, setListNotification] = useState([]);
  const [showButtonEdit, setShowButtonEdit] = useState(false);
  const [idUpdate, setIdUpdate] = useState("");

  const { _id } = dataLocalStorage();

  useEffect(async () => {
    try {
      const ress = await axios.get(`${BASE_URL}/show-all-notification`);
      if (ress.status === 200) {
        setListNotification(ress.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }, [toast]);

  const handleSubmitForm = async () => {
    if (!description || !topic) {
      alert("Khong duoc de trong");
    } else {
      try {
        const res = await axios.post(`/create-notification`, {
          idTeacher: _id,
          title: topic,
          description: description,
        });
        if (res.status === 200) {
          setToast(true);
          setTopic("");
          setDescription("");
          setShowButtonEdit(false);
        }
      } catch (error) {
        alert("File Has Exist");
      }
    }
  };

  const handleUpdateForm = async () => {
    if (!description || !topic) {
      alert("Khong duoc de trong");
    } else {
      try {
        const res = await axios.put(`/edit-notification`, {
          idTeacher: _id,
          title: topic,
          description: description,
          idNotification: idUpdate,
        });
        if (res.status === 200) {
          setToast(true);
          setTopic("");
          setDescription("");
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
      const ress = await axios.get(`${BASE_URL}/show-notification/${id}`);
      if (ress.status === 200) {
        const { title, description, _id } = ress.data.data;
        setDescription(description);
        setTopic(title);
        setIdUpdate(_id);
      }
    } catch (error) {
      alert("Fetch Fails");
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const ress = await axios.delete(`${BASE_URL}/delete-notification/${id}`);
      if (ress.status === 200) {
        setToast(true);
      }
    } catch (error) {
      alert("Delete Fails");
    }
  };

  const handleActiveStatus = async (status, id) => {
    try {
      const res = await axios.put(`/update-status-notification`, {
        isShow: !status,
        idNotification: id,
      });
      if (res.status === 200) {
        setToast(true);
      }
    } catch (error) {
      alert("File Has Exist");
    }
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
          Thông Báo
        </Typography>
        <Suspense fallback={<div>Loading...</div>}>
          <Container fluid className="mb-5">
            <Row>
              <Col md={6}>
                <Paper className="p-5 m-3 shadow">
                  <Typography
                    className="text-center font-weight-bold pb-4"
                    variant="h5"
                  >
                    Danh sách Thông Báo
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
                              Hiển thị
                            </TableCell>
                            <TableCell align="center" className="text-light">
                              Người gửi
                            </TableCell>
                            <TableCell align="center" className="text-light">
                              Tiêu đề
                            </TableCell>
                            <TableCell align="center" className="text-light">
                              Hành động
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {listNotification.map((row) => (
                            <TableRow key={row._id}>
                              <TableCell align="center">
                                <input
                                  type="checkbox"
                                  checked={row.isShow}
                                  onChange={() =>
                                    handleActiveStatus(row.isShow, row._id)
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                {row?.idTeacher?.userName}
                              </TableCell>
                              <TableCell align="center">{row.title}</TableCell>
                              <TableCell align="center">
                                <Button
                                  variant="outlined"
                                  style={{
                                    fontSize: "8px",
                                  }}
                                  onClick={() => handleEditItem(row._id)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="contained"
                                  style={{ fontSize: "8px" }}
                                  onClick={() => handleDeleteItem(row._id)}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Container>
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
                              Mô tả thông báo
                            </label>
                            <textarea
                              className="form-control"
                              id="product_title"
                              onChange={(e) => setDescription(e.target.value)}
                              required
                              value={description}
                              cols="5"
                              rows="3"
                            ></textarea>
                          </div>
                          <div className="mb-4">
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

export default TeacherNotification;

import React, { useState } from "react";
import { Link, NavLink, useHistory, withRouter } from "react-router-dom";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ChatIcon from "@material-ui/icons/Chat";
import SettingsIcon from "@material-ui/icons/Settings";
import { Avatar, Button, IconButton } from "@material-ui/core";
import "./Header.css";
import ClearIcon from "@material-ui/icons/Clear";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import NotesIcon from "@material-ui/icons/Notes";
import { useDispatch } from "react-redux";

const Header = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const toggleClose = () => {
    setToggle(false);
  };
  return (
    <div className="header">
      <div className="left__header">
        <Link to="/">
          <img
            src="https://thumbs.dreamstime.com/b/e-learning-icon-trendy-logo-concept-white-backgro-background-education-collection-suitable-use-web-apps-mobile-131175980.jpg"
            alt=""
          />
          <h4>Elearning</h4>
        </Link>
      </div>
      <div
        className={`middle__header ${
          toggle ? `show__sidebar__nav` : `sidebar__nav`
        }`}
      >
        {user && (
          <ul>
            {user.role === "Teacher" && (
              <>
                {" "}
                <li>
                  <NavLink onClick={toggleClose} to="/teacher-dashboard">
                    Trang Chủ
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={toggleClose} to="/course-info">
                    Khóa Học
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={toggleClose} to="/course-info-notification">
                    Thông Báo
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={toggleClose} to="/all-courses">
                    Tất cả Khóa Học
                  </NavLink>
                </li>
              </>
            )}
            {user.role === "Admin" && (
              <>
                {" "}
                <li>
                  <NavLink onClick={toggleClose} to="/admin-dashboard">
                    Trang Chủ
                  </NavLink>
                </li>
                <li className="admin__toggle__menu">
                  <NavLink onClick={toggleClose} to="/admin/course-info">
                    Khóa Học
                  </NavLink>
                </li>
                <li className="admin__toggle__menu">
                  <NavLink onClick={toggleClose} to="/admin/student-info">
                    Học Sinh
                  </NavLink>
                </li>
                <li className="admin__toggle__menu">
                  <NavLink onClick={toggleClose} to="/admin/teacher-info">
                    Giáo Viên
                  </NavLink>
                </li>
              </>
            )}
            {user.role === "Student" && (
              <>
                <li>
                  <NavLink onClick={toggleClose} to="/">
                    Trang Chủ
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink onClick={toggleClose} to="/ucam">
                    UCAM
                  </NavLink>
                </li>
                <li>
                  <NavLink onClick={toggleClose} to="/library">
                    LIBRARY
                  </NavLink>
                </li>{" "} */}
              </>
            )}

            <li>
              <Link onClick={toggleClose} to="/profile">
                Thông Tin Cá Nhân
              </Link>
            </li>
            {user.role === "Teacher" ? (
              <li className="">
                <Button
                  onClick={() => {
                    localStorage.clear("user");
                    localStorage.clear("auth_token");
                    dispatch({ type: "CLEAR__USER" });
                    history.push("/login");
                  }}
                >
                  Đăng Xuất
                </Button>
              </li>
            ) : (
              <li className="logout__button">
                <Button
                  onClick={() => {
                    localStorage.clear("user");
                    localStorage.clear("auth_token");
                    dispatch({ type: "CLEAR__USER" });
                    history.push("/login");
                  }}
                >
                  Đăng Xuất
                </Button>
              </li>
            )}
          </ul>
        )}
      </div>
      {user ? (
        <div className="right__header">
          <Link to="/profile">
            <Avatar>R</Avatar>
          </Link>
        </div>
      ) : (
        <div className="d-flex list-unstyled">
          <li className="mr-3">
            <NavLink to="/Login">Đăng Nhập </NavLink>
          </li>
          <li>
            <NavLink to="/Register">Đăng ký</NavLink>
          </li>
        </div>
      )}

      {user ? (
        <div className="menu__toggle__icon mr-auto">
          <IconButton onClick={() => setToggle(!toggle)}>
            {!toggle ? (
              <NotesIcon fontSize="large" />
            ) : (
              <ClearIcon fontSize="large" />
            )}
          </IconButton>
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(Header);

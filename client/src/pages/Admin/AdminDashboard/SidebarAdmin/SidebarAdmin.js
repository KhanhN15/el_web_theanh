import React from "react";
import Styles from "./SidebarAdmin.module.css";
import Sidebar from "../../../../components/Sidebar/Sidebar";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import GroupIcon from "@material-ui/icons/Group";
import PersonIcon from "@material-ui/icons/Person";

const SidebarAdmin = () => {
  return (
    <div className={Styles.sidebarAdmin}>
      <Sidebar title="Dashboard" link="/admin-dashboard" Icon={DashboardIcon} />
      <Sidebar
        title="Khóa Học"
        link="/admin/course-info"
        Icon={LocalLibraryIcon}
      />
      <Sidebar title="Học Sinh" link="/admin/student-info" Icon={GroupIcon} />
      <Sidebar title="Giáo Viên" link="/admin/teacher-info" Icon={PersonIcon} />
      <Sidebar
        title="Đăng Xuất"
        link="/admin/teacher-info"
        Icon={ExitToAppIcon}
      />
    </div>
  );
};

export default SidebarAdmin;

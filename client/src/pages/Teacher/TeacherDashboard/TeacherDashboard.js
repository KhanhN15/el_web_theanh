import React from "react";
import { Col, Container } from "react-bootstrap";
import { Paper, Typography } from "@material-ui/core";

const TeacherDashboard = () => {
  return (
    <div>
      <Container>
        <Col md={10} className="mx-auto">
          <Container>
            <Paper>
              <Typography
                className="text-center text-primary py-5"
                variant="h4"
              >
                Chào mừng bạn đến với trang chủ của Giáo Viên
              </Typography>
            </Paper>
          </Container>
        </Col>
      </Container>
    </div>
  );
};

export default TeacherDashboard;

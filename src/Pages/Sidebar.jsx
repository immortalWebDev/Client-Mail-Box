import { useState,lazy,Suspense } from "react";
import { NavLink, useLocation, useHistory } from "react-router-dom";
// import {
  // Row,
  // Col,
  // ButtonGroup,
  // ToggleButton,
  // Container,
  // Offcanvas,
// } from "react-bootstrap";

import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton"
import Container from "react-bootstrap/Container"
import Offcanvas from "react-bootstrap/Offcanvas"
import { useSelector } from "react-redux";
import Logout from "../component/userAuth/Logout";
// import Notification from "../component/userInterface/Notification";
import Header from "./Header";
import MailRoutes from "../component/userInterface/MailRoutes";
import WelcomeLand from "./WelcomeLand";

const LazyNotification = lazy(() => import("../component/userInterface/Notification"))


const Sidebar = () => {
  const history = useHistory();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const { message, variant } = useSelector((state) => state.auth.notification);
  const filteredMails = mails.filter(
    (mail) => mail.recipient === email && mail.isTrashed === false
  );
  let unreadMails = 0;
  filteredMails.forEach((mail) => {
    if (!mail.isRead) {
      unreadMails++;
    }
  });

  const onClickHandler = () => {
    setShow(false);
  };

  const showAboutUS = () => {
    history.replace("/Sidebar");
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <Container fluid>
      <Row className="vh-100 overflow-hidden">
        <Col
          className="d-flex flex-column p-0 pb-4 sidebar-container"
          xs="auto"
        >
          <Offcanvas
            className="p-lg-4 offcanvas-container"
            show={show}
            onHide={handleClose}
            responsive="lg"
          >
            <Offcanvas.Body className="d-flex flex-column p-lg-2">
              <div
                className="text-center offcanvas-body-container"
                onClick={showAboutUS}
              >
                <i className="bi-envelope-fill fs-1 mex-logo"></i>
                <p className="ps-2 fs-4 fw-bold mex-title">
                  <b>Mail Express</b>
                </p>
              </div>
              <div className="text-start mt-5">
                <ButtonGroup className="d-flex h-100 flex-column">
                  <NavLink
                    to="/Sidebar/ComposeMail"
                    activeClassName="bg-warning rounded-4"
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-light"
                      className="py-2 w-100 border-0 rounded-0 text-start text-dark fw-bold"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 bi bi-file-text compose-logo"></i>{" "}
                      Compose
                    </ToggleButton>
                  </NavLink>
                  <NavLink
                    to="/Sidebar/inbox"
                    activeClassName="bg-warning rounded-4"
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start border-0 py-2 text-dark fw-bold"
                      onClick={onClickHandler}
                    >
                      <div className="d-flex">
                        <span>
                          <i className="bi bi-envelope-paper fs-4 pe-2 inbox-logo"></i>{" "}
                          {`Inbox U(${unreadMails})`}
                        </span>
                      </div>
                    </ToggleButton>
                  </NavLink>
                  <NavLink
                    to="/Sidebar/sent"
                    activeClassName="bg-warning rounded-4"
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="py-2 w-100 rounded-0 text-start border-0 text-dark fw-bold"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 bi bi-send sent-logo"></i> Sent
                    </ToggleButton>
                  </NavLink>

                  <NavLink
                    to="/Sidebar/starred"
                    activeClassName="bg-warning rounded-4"
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-dark fw-bold"
                      onClick={onClickHandler}
                    >
                      <i className="bi fs-4 pe-2 bi-star starred-logo"></i>{" "}
                      Starred
                    </ToggleButton>
                  </NavLink>
                  <NavLink
                    to="/Sidebar/trash"
                    activeClassName="bg-warning rounded-4"
                  >
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-dark fw-bold"
                      onClick={onClickHandler}
                    >
                      <i className="fs-4 pe-2 bi bi-trash trash-logo"></i> Trash
                    </ToggleButton>
                  </NavLink>
                </ButtonGroup>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
          <div className="mt-auto d-none d-lg-block ms-4">
            <p className="mb-0">Logged in as:</p>
            <p
              className="mb-2 text-dark fw-bold text-truncate email-container"
              title={email}
            >
              {email}
            </p>
            <Logout />
          </div>
        </Col>

        <Col className="overflow-auto main-content">
          {message && (
            <div className="fixed-bottom ms-auto mb-3 me-2 notification-bottom">
              <Suspense fallback={<div>Loading Notification...</div>}>
              <LazyNotification message={message} variant={variant} />
              </Suspense>
            </div>
          )}

          <Header handleShow={handleShow} />
          <h2 className="mt-3 mb-0 welcome-text-top">
            Mail Express: Converse Smoothly
          </h2>
          {location.pathname === "/Sidebar" && <WelcomeLand />}

          <MailRoutes />
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;

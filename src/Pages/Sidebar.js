import { NavLink, useHistory } from "react-router-dom";
import {
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
  Container,
  Offcanvas,
} from "react-bootstrap";
import { useState } from "react";
import { useSelector } from "react-redux";
import Logout from "../component/userAuth/Logout";

import MailRoutes from "../component/userInterface/MailRoutes";

const Sidebar = () => {
  const history = useHistory();

  const [show, setShow] = useState(false);
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const { message } = useSelector((state) => state.auth.notification);
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
  

  return (
    <Container fluid>
      <Row className="vh-100 overflow-hidden">
        <Col
          className="d-flex flex-column p-0 pb-4"
          xs="auto"
          style={{ backgroundColor: "#f0f0f0" }}
          // style={{ backgroundColor: "#e2e3e5" }}
        >
          <Offcanvas
            className="p-lg-4"
            show={show}
            onHide={handleClose}
            responsive="lg"
          >
            <Offcanvas.Body className="d-flex flex-column">
              <div
                className="text-center"
                onClick={showAboutUS}
                style={{ cursor: "pointer" }}
              >
                <i
                  className="bi-envelope-fill fs-1"
                  style={{ color: "#3498db" }}
                ></i>
                <p
                  className="ps-2 fs-4"
                  style={{ fontFamily: "Roboto, sans-serif", color: "#3498db" }}
                >
                  Mail Express
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
                      className="py-2 w-100 border-0 rounded-0"
                      onClick={onClickHandler}
                    >
                      <i
                        className="fs-4 pe-2 bi bi-file-text"
                        style={{ color: "#3498db" }}
                      ></i>{" "}
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
                      className="rounded-0 w-100"
                      onClick={onClickHandler}
                    >
                      <div className="d-flex">
                        <span>
                          <i
                            className="bi bi-envelope-paper fs-4 pe-2"
                            style={{ color: "#3498db" }}
                          ></i>{" "}
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
                      className="py-2 w-100"
                      onClick={onClickHandler}
                    >
                      <i
                        className="fs-4 pe-2 bi bi-send"
                        style={{ color: "#3498db" }}
                      ></i>{" "}
                      Sent
                    </ToggleButton>
                  </NavLink>

                  <NavLink to="/Sidebar/starred">
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100 text-start py-2 border-0 text-dark"
                      onClick={onClickHandler}
                    >
                      <i
                        className="bi fs-4 pe-2 bi-star"
                        style={{ color: "#3498db" }}
                      ></i>{" "}
                      Starred
                    </ToggleButton>
                  </NavLink>
                  <NavLink to="/Sidebar/trash">
                    <ToggleButton
                      id="toggle-check"
                      type="checkbox"
                      variant="outline-secondary"
                      className="rounded-0 w-100"
                      onClick={onClickHandler}
                    >
                      <i
                        className="fs-4 pe-2 bi bi-trash"
                        style={{ color: "#3498db" }}
                      ></i>{" "}
                      Trash
                    </ToggleButton>
                  </NavLink>
                </ButtonGroup>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
          <div className="mt-auto d-none d-lg-block ms-4">
            <p className="mb-0">Logged in as:</p>
            <p className="mb-2 text-dark fw-bold">
              {localStorage.getItem("email")}
            </p>

            <Logout />
          </div>
        </Col>

        <Col
          style={{ maxHeight: "100vh", backgroundColor: "#fbfbfb" }}
          className="overflow-auto"
        >
          {message && (
            <div style={{ maxWidth: "20rem" }} className="fixed-bottom"></div>
          )}

          <h2
            className="mt-3 mb-2"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Welcome to Mail Express
          </h2>

          <MailRoutes />
        </Col>
      </Row>
    </Container>
  );
};

export default Sidebar;

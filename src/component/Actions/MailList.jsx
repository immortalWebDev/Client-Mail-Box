// import { ListGroup, Row, Col, Form } from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import { Link, useLocation } from "react-router-dom";
import { setIsChecked, setRead, toggleStarred } from "../../store/mailSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import DOMPurify from "dompurify";
import { getToken } from "../../firebaseHelper";

const MailList = (props) => {

  
  const { mail } = props;
  // console.log(mail)

  // console.log(mail)

  const email = useSelector((state) => state.auth.email);
  const token = useSelector((state) => state.auth.idToken);
  const tokenExpiry = useSelector((state) => state.auth.tokenExpiry);


  const senderMail = email.replace(/[.]/g, "");
  const location = useLocation();

  // console.log(email,senderMail,location)
  const dispatch = useDispatch();
  const { fetchData } = useFetch();

  const onCheckHandler = () => {
    // console.log('single check')
    dispatch(setIsChecked({ id: mail.id, selector: "single" }));
  };

  const [isHovered, setIsHovered] = useState(false);
  const [starHovered, setStarHovered] = useState(false);

  const starMouseEnter = () => {
    setStarHovered(true);
  };
  const starMouseLeave = () => {
    setStarHovered(false);
  };
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  
  const checkToken = () => {
    if (token && Date.now() > tokenExpiry) {
      return getToken();
    }
  };

  const validToken = checkToken() || token;


  const url =
    mail.sender === email
      ? `${import.meta.env.VITE_FIREBASE_URL}/sent-emails/${senderMail}/${mail.id}.json?auth=${validToken}`
      : `${import.meta.env.VITE_FIREBASE_URL}/emails/${mail.id}.json?auth=${validToken}`;

  const starClickHandler = (event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(toggleStarred({ id: mail.id }));

    fetchData(url, "PUT", {
      ...mail,
      starred: !mail.starred,
    });
  };

  const onClickHandler = () => {
    dispatch(setIsChecked({ id: null, selector: "none" }));

    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(setRead({ id: mail.id }));
      }
    };

    if (!mail.isRead) {
      fetchData(
        url,
        "PUT",
        {
          ...mail,
          isRead: true,
        },
        onSuccess
      );
    }
  };

  const getMailAddress = (mail) => {
    if (
      location.pathname === "/Sidebar/inbox" ||
      location.pathname === "/Sidebar/starred" ||
      location.pathname === "/Sidebar/trash"
    ) {
      return mail.sender;
    } else if (location.pathname === "/Sidebar/sent") {
      return mail.recipient;
    }
    return "";
  };

  return (
    <ListGroup.Item
      as={Link}
      to={
        location.pathname === "/Sidebar/inbox"
          ? `/Sidebar/inbox/${mail.id}`
          : location.pathname === "/Sidebar/trash"
          ? `/Sidebar/trash/${mail.id}`
          : location.pathname === "/Sidebar/sent"
          ? `/Sidebar/sent/${mail.id}`
          : `/Sidebar/starred/${mail.id}`
      }
      className={`mb-1 py-2 border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      } ${isHovered ? "shadow-lg" : ""}`}
      onClick={onClickHandler}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Row>
        <Col lg="3">
          <div className="d-flex">
            <Form>
              <Form.Check
                checked={mail.isChecked}
                onChange={onCheckHandler}
                onClick={(e) => e.stopPropagation()}
              />
            </Form>

            <div>
              {mail.starred ? (
                <i
                  className={`bi bi-star-fill text-warning px-1 ms-2 ${
                    starHovered ? "bg-secondary bg-opacity-10 rounded" : ""
                  }`}
                  onClick={starClickHandler}
                  onMouseEnter={starMouseEnter}
                  onMouseLeave={starMouseLeave}
                />
              ) : (
                <i
                  className={`bi bi-star px-1 ms-2 ${
                    starHovered ? "bg-secondary rounded bg-opacity-10" : ""
                  }`}
                  onClick={starClickHandler}
                  onMouseEnter={starMouseEnter}
                  onMouseLeave={starMouseLeave}
                />
              )}
            </div>

            <p className="fw-bold ps-2 m-0">
              <i
                className={`bi ${
                  mail.isRead || location.pathname === "/Sidebar/sent"
                    ? "invisible"
                    : ""
                } bi-record-fill text-primary pe-1`}
              ></i>
              {getMailAddress(mail)}
            </p>
          </div>{" "}
        </Col>
        <Col lg="8" className="pt-1 pt-lg-0">
          <div className="ps-3">
            <span className="fw-bold">{mail.subject}</span>
            <span
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  `${mail.emailContent.substring(0, 100)}...`
                ),
              }}
            ></span>
          </div>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};

export default MailList;

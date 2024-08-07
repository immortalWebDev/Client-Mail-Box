import { ListGroup, Row, Col, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { setIsChecked, setRead} from "../../store/mailSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import DOMPurify from "dompurify";

const MailList = (props) => {
  const { mail } = props;
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");
  const location = useLocation();
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

  const url =
    mail.sender === email
      ? `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${senderMail}/${mail.id}.json`
      : `https://mail-box-piyush-default-rtdb.firebaseio.com/emails/${mail.id}.json`;

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

  return (
    <ListGroup.Item
      as={Link}
      to={
        location.pathname === "/Sidebar/inbox"
          ? `/Sidebar/inbox/${mail.id}`
          : location.pathname === "/Sidebar/sent"
          ? `/Sidebar/sent/${mail.id}`
          : `/Sidebar/starred/${mail.id}`
      }
      className={`mb-1 py-2 border-bottom ${
        mail.isChecked ? "bg-success bg-opacity-25" : ""
      }`}
      onClick={onClickHandler}
    >
      <Row>
        <Col lg="3">
          <div className="d-flex">
            <Form>
              <Form.Check
                checked={mail.isChecked}
                onChange={() => dispatch(setIsChecked({ id: mail.id, selector: "SINGLE" }))}
                onClick={(e) => e.stopPropagation()}
              />
            </Form>
            <p className="fw-bold ps-2 m-0">
              <i className={`bi ${mail.isRead ? "invisible" : ""} bi-record-fill text-primary pe-1`}></i>
              {mail.sender}
            </p>
          </div>
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

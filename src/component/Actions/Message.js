import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../userInterface/LoadingSpinner";
import { moveToTrash, deleteForever } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import DOMPurify from "dompurify";
import useFetch from "../../hooks/useFetch";

const Message = () => {

  const dispatch = useDispatch();
  const { messageId } = useParams();
  const location = useLocation();

  const mails = useSelector((state) => state.mail.mails);
  const mail = mails.find((mail) => mail.id === messageId);
  const history = useHistory();
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");
  const { fetchData } = useFetch();

  let url;
  if (mails.length > 0) {
    url =
      mail.sender === email
        ? `${process.env.REACT_APP_FIREBASE_URL}/sent-emails/${senderMail}/${mail.id}.json`
        : `${process.env.REACT_APP_FIREBASE_URL}/emails/${mail.id}.json`;
  }

  const moveToTrashHandler = () => {
    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(moveToTrash(messageId));
        dispatch(
          showNotification({ message: "Moved to trash!", variant: "success" })
        );

        //using if else
        if (location.pathname === `/Sidebar/inbox/${mail.id}`) {
          history.replace("/Sidebar/inbox");
        } else if (location.pathname === `/Sidebar/trash/${mail.id}`) {
          history.replace("/Sidebar/trash");
        } else if (location.pathname === `/Sidebar/sent/${mail.id}`) {
          history.replace("/Sidebar/sent");
        } else {
          history.replace("/Sidebar/starred");
        }
      }
    };

    fetchData(
      url,
      "PUT",
      {
        ...mail,
        isTrashed: true,
      },
      onSuccess
    );
  };

  const deleteForeverHandler = () => {
    dispatch(deleteForever({ id: messageId }));
    history.replace("/Sidebar/trash");
    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(
          showNotification({
            message: "Mail deleted forever",
            variant: "success",
          })
        );
      }
    };

    fetchData(url, "DELETE", null, onSuccess);
  };

  const onBackHandler = () => {
    history.replace(
      //using ternary
      location.pathname === `/Sidebar/inbox/${mail.id}`
        ? "/Sidebar/inbox"
        : location.pathname === `/Sidebar/trash/${mail.id}`
        ? "/Sidebar/trash"
        : location.pathname === `/Sidebar/sent/${mail.id}`
        ? "/Sidebar/sent"
        : "/Sidebar/starred"
    );
  };
  
  if (mails.length === 0) {
    return (
      <Container className="h-100">
        <div className="h-100 d-flex justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      </Container>
    );
  }

  return (
    <>
      <div className="border-bottom py-2 px-1 d-flex align-items-center message-content-inbox">
        <p className="m-0 go-back-button" onClick={onBackHandler}>
          <i className="bi bi-chevron-double-left pe-2"></i>
          <span>Go back</span>
        </p>

        {location.pathname !== `/Sidebar/trash/${messageId}` ? (
          <Button
            variant="primary"
            size="sm"
            className="px-2 border-0 ms-auto"
            onClick={moveToTrashHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash"></i>
              <span>Trash it</span>
            </p>
          </Button>
        ) : (
          <Button
            variant="danger"
            className="px-2 border-0 ms-auto"
            onClick={deleteForeverHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning pe-2 bi-trash"></i>
              <span>Delete Forever</span>
            </p>
          </Button>
        )}
      </div>
      <div className="overflow-auto compose-details">
        <div className="pt-3">
          <span className="fw-bold">From: </span>
          <span>{mail.sender}</span>
        </div>
        <div>
          <span className="fw-bold">To: </span>
          <span>{`(${mail.recipient})`} </span>
          <p className="fw-bold pt-2">Subject: {mail.subject}</p>
          <span className="fw-bold">Date & Time:</span>{" "}
          {mail.timestamp
            ? new Date(mail.timestamp).toLocaleString()
            : "Not Available"}
        </div>

        <hr />
        <div className="mt-3 matter-mail">
          <p className="text-dark fw-bold text-decoration-underline">
            Matter of Mail:
          </p>

          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(mail.emailContent),
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default Message;

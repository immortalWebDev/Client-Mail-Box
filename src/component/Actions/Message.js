import { useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Container, Button } from "react-bootstrap";
import LoadingSpinner from "../userInterface/LoadingSpinner";
import { moveToTrash, deleteForever } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import useFetch from "../../hooks/useFetch";

const Message = () => {
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
    if (mail.sender === email) {
      url = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${senderMail}/${mail.id}.json`;
    } else {
      url = `https://mail-box-piyush-default-rtdb.firebaseio.com/emails/${mail.id}.json`;
    }
  }

  const moveToTrashHandler = () => {
    const onSuccess = (response) => {
      if (response.status === 200) {
        dispatch(moveToTrash(messageId));
        dispatch(
          showNotification({ message: "Moved to trash!", variant: "success" })
        );
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
    if (location.pathname === `/Sidebar/inbox/${mail.id}`) {
      history.replace("/Sidebar/inbox");
    } else if (location.pathname === `/Sidebar/trash/${mail.id}`) {
      history.replace("/Sidebar/trash");
    } else if (location.pathname === `/Sidebar/sent/${mail.id}`) {
      history.replace("/Sidebar/sent");
    } else {
      history.replace("/Sidebar/starred");
    }
  };

  const dispatch = useDispatch();
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
      <div className="border-bottom py-2 px-1 d-flex">
        <p className="m-0" onClick={onBackHandler}>
          <i></i>
          <span>Go back</span>
        </p>

        {location.pathname !== `/Sidebar/trash/${messageId}` ? (
          <Button
            className="px-2 border-0 ms-auto"
            onClick={moveToTrashHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i className="bi text-warning"></i>
              <span>Delete</span>
            </p>
          </Button>
        ) : (
          <Button
            className="px-2 border-0 ms-auto"
            onClick={deleteForeverHandler}
          >
            <p className="mx-auto p-0 m-0">
              <i></i>
              <span>Delete Forever</span>
            </p>
          </Button>
        )}
      </div>
      <div style={{ maxHeight: "80vh" }} className="overflow-auto">
        <div className="pt-3">
          <span>From: </span>
          <span>{mail.sender}</span>
        </div>
        <div>
          <span >To: </span>
          <span>{`(${mail.recipient})`}</span>
          <p className="pt-2">Subject: {mail.subject}</p>
        </div>

        <hr />
        <div className="mt-3">
          <div>{mail.emailContent.substring(0, 100)}</div>
        </div>
      </div>
    </>
  );
};

export default Message;

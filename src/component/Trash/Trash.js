import { useState,useEffect } from "react";
import axios from "axios";
import { Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MailList from "../Actions/MailList";
import DropdownMenu from "../Actions/DropdownMenu";
import ConfirmationModal from "./ConfirmationModal";
import { moveFromInbox, moveFromSent,emptyTrash,setIsChecked } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import LoadingSpinner from "../userInterface/LoadingSpinner";


const Trash = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const senderMail = email.replace(/[.]/g, "");
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);

  
  const filteredMails = mails.filter((mail) => mail.isTrashed);

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  const url1 = `${process.env.REACT_APP_FIREBASE_URL}/emails`;
  const url2 = `${process.env.REACT_APP_FIREBASE_URL}/sent-emails/${senderMail}`;

  const onRestoreHandler = async () => {
    try {
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            mail.sender === email
              ? `${url2}/${mail.id}.json`
              : `${url1}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              isTrashed: false,
            }
          )
        );

      await Promise.all(updatedPromises);
      dispatch(
        showNotification({
          message: "Restored! ",
          variant: "success",
        })
      );
      dispatch(moveFromInbox({ move: "toInbox", email: email }));
      dispatch(moveFromSent({ move: "toSentbox", email: email }));
    } catch (error) {
      console.log(error.message);
    }
  };

  const emptyTrashHandler = async () => {
    try {
      const updatedPromises = filteredMails.map((mail) =>
        axios.delete(
          mail.sender === email
            ? `${url2}/${mail.id}.json`
            : `${url1}/${mail.id}.json`
        )
      );
      await Promise.all(updatedPromises);

      dispatch(emptyTrash());
      setShow(false);
      dispatch(
        showNotification({
          message: "Trash is cleared",
          variant: "success",
        })
      );
    } catch (error) {
      const { data } = error.response;
      console.log(data.error.message);
    }
  };
   
   useEffect(() => {
    return () => {
      dispatch(setIsChecked({ id: null, selector: "none" }));
    };
  }, [dispatch]);
  
  return (
    <>
      {
        <ConfirmationModal
          handleClose={handleClose}
          show={show}
          emptyTrashHandler={emptyTrashHandler}
        />
      }

      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <DropdownMenu filteredMails={filteredMails} />
        <div className="ms-auto">
          <Button
            disabled={filteredMails.length === 0}
            size="sm"
            variant="danger"
            className="border-0 me-3 bi-trash"
            onClick={handleShow}
          >
            {`${"  Delete Permanently"}`}
          </Button>
          <Button
            disabled={!isDeleteEnabled}
            size="sm"
            variant="primary"
            className="border-0 "
            onClick={onRestoreHandler}
          >
            Restore Mails
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : filteredMails.length === 0 ? (
        <p className="text-center mt-4 fw-bold fs-7">
          Your trash bin is clean and tidy! Deleted messages are moved here.
          Restore or delete messages to keep things organized.
        </p>
      ) : (
        <ListGroup variant="flush" className="overflow-auto">
          {filteredMails.map((mail) => (
            <MailList mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Trash;

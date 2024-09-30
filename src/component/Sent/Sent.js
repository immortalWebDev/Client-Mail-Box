import { useEffect } from "react";
import DropdownMenu from "../Actions/DropdownMenu";
import { Button, ListGroup } from "react-bootstrap";
import LoadingSpinner from "../userInterface/LoadingSpinner";
import MailList from "../Actions/MailList";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { moveFromSent,setIsChecked } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import axios from "axios";



const Sent = () => {
  
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const senderMail = email.replace(/[.]/g, "");

  const reversedMails = [...mails].reverse();
  
  const sentMails = reversedMails.filter(
    (mail) => !mail.isTrashed && mail.sender === email
  );
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const isDeleteEnabled = sentMails.some((mail) => mail.isChecked);
  const onDeleteHandler = async () => {
    try {
      const updatedPromises = sentMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `${process.env.REACT_APP_FIREBASE_URL}/sent-emails/${senderMail}/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              isTrashed: true,
            }
          )
        );
      await Promise.all(updatedPromises);

      dispatch(moveFromSent({ move: "toTrash", email: email }));
      dispatch(
        showNotification({ message: "Moved to trash!", variant: "success" })
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
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <DropdownMenu filteredMails={sentMails} />
        <div className="ms-auto">
        <Button
            variant="primary"
            className="px-2 border-2"
            disabled={!isDeleteEnabled}
            onClick={onDeleteHandler}
          >
            Delete Mail
          </Button>
        </div>
      </div>
      {isLoading ? (
        <div className=" d-flex h-50 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : sentMails.length === 0 ? (
        <>
          <p className="text-center mt-4 fw-bold fs-7">
            Your sent folder looks empty! Every sent message starts a
            conversation. Compose and send your first message with Mail Express.
          </p>

          <div className="text-center mt-3">
            <Link to="/Sidebar/ComposeMail" className="btn btn-primary">
              Click to compose now
            </Link>
          </div>
        </>
      ) : (
        <ListGroup variant="flush">
          {sentMails.map((mail) => (
            <MailList mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Sent;

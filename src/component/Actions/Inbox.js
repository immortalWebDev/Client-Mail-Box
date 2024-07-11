import { useEffect } from "react";
import { ListGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import {Link} from 'react-router-dom'
import axios from "axios";
import MailList from "./MailList";
import { moveFromInbox,setIsChecked} from "../../store/mailSlice";
import LoadingSpinner from "../userInterface/LoadingSpinner";
import { showNotification } from "../../store/authSlice";
import DropdownMenu from "../Actions/DropdownMenu";



const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);

  const reversedMails = [...mails].reverse();

  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = reversedMails.filter(
    (mail) => mail.isTrashed === false && mail.recipient === email
  );

  const isDeleteEnabled = filteredMails.some((mail) => mail.isChecked);

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = filteredMails
        .filter((mail) => mail.isChecked)
        .map((mail) =>
          axios.put(
            `https://mail-box-piyush-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
            {
              ...mail,
              isChecked: false,
              isTrashed: true,
            }
          )
        );

      await Promise.all(updatedPromises);

      dispatch(moveFromInbox({ move: "toTrash", email: email }));
      dispatch(
        showNotification({ message: "Moved to Trash!", variant: "success" })
      );
    } catch (error) {
      console.log(error.message);
    }
  };
   
   useEffect(() => {
    return () => {
      dispatch(setIsChecked({ id: null, selector: "none" }));
    };
  }, [dispatch]);

  return (
    <div className="">
      <div className="border-bottom d-flex align-items-center py-2 px-1 mt-5 mt-lg-0">
        <DropdownMenu filteredMails={filteredMails} />
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
        <div className="d-flex mt-5 pt-5 justify-content-center align-items-center">
          <LoadingSpinner />
        </div>
      ) : filteredMails.length === 0 ? (
        <>
        <p className="text-center mt-4 fw-bold fs-7">Your inbox is feeling light! Start by composing your first message and let Mail Express fill it up with conversations</p>

        <div className="text-center mt-3">
        <Link to="/Sidebar/ComposeMail" className="btn btn-primary">
          Click to compose now
        </Link>
      </div>
      </>


      ) : (
        <ListGroup variant="flush" className="overflow-auto">
          {filteredMails.map((mail) => (
            <MailList mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default Inbox;

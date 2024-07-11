
import { useEffect } from "react";
import { Button, ListGroup } from "react-bootstrap";
import LoadingSpinner from "../userInterface/LoadingSpinner";
import MailList from "../Actions/MailList";
import { useDispatch, useSelector } from "react-redux";
import { moveFromStarred, setIsChecked } from "../../store/mailSlice";
import { showNotification } from "../../store/authSlice";
import axios from "axios";

const Starred = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const isLoading = useSelector((state) => state.mail.isLoading);
  const dispatch = useDispatch();
  const senderMail = email.replace(/[.]/g, "");
  const starredMails = mails.filter((mail) => mail.starred && !mail.isTrashed);
  const isDeleteEnabled = starredMails.some((mail) => mail.isChecked);
  const url1 = `https://mail-box-piyush-default-rtdb.firebaseio.com/emails`;
  const url2 = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${senderMail}`;

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = starredMails
  .filter((mail) => mail.isChecked)
  .map((mail) => {
    let url;
    if (mail.sender === email) {
      url = `${url2}/${mail.id}.json`;
    } else {
      url = `${url1}/${mail.id}.json`;
    }
    
    return axios.put(url, {
      ...mail,
      isChecked: false,
      isTrashed: true,
    });
  });

      await Promise.all(updatedPromises);
      dispatch(moveFromStarred("toTrash"));
      dispatch(
        showNotification({
          message: "Moved to Trash!",
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
      <div className="border-bottom d-flex align-items-center">
        
        <div className="ms-auto">
          <Button
            variant="primary"
            className="px-2"
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
      ) : starredMails.length === 0 ? (
        <p className="text-center">
          No starred nails
        </p>
      ) : (
        <ListGroup>
          {starredMails.map((mail) => (
            <MailList mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Starred;

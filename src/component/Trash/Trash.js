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

  const filteredMails = mails.filter((mail) => mail.isTrashed);

  const isDeleteEnabled = filteredMails.some((item) => item.isChecked);

  const url1 = `https://mail-box-piyush-default-rtdb.firebaseio.com/emails`;
  const url2 = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${senderMail}`;

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
          onClick={emptyTrashHandler}
        >
          Delete Permanently
        </Button>
      </div>
      {filteredMails.length === 0 ? (
        <p>Trash is empty</p>
      ) : (
        <ListGroup>
          {filteredMails.map((mail) => (
            <MailList mail={mail} key={mail.id} />
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default Trash;

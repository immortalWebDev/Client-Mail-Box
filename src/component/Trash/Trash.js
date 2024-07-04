import { Button, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import MailList from "../Mailbox/MailList";
import { emptyTrash } from "../../store/mailSlice";
import axios from "axios";

const Trash = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  
  const senderMail = email.replace(/[.]/g, "");
  const dispatch = useDispatch();

  const filteredMails = mails.filter((mail) => mail.isTrashed);

  const url1 = `https://mail-box-piyush-default-rtdb.firebaseio.com/emails`;
  const url2 = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${senderMail}`;


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
    } catch (error) {
      const { data } = error.response;
      console.log(data.error.message);
    }
  };

  return (
    <>
      <div>
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

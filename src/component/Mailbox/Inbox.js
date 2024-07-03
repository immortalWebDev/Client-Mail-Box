import { ListGroup, Button } from "react-bootstrap";
import { useSelector} from "react-redux";
import axios from "axios";

const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = mails.filter((mail) => mail.recipient === email);

  const onDeleteHandler = async () => {
    try {
      const updatedPromises = filteredMails.map((mail) =>
        axios.put(
          `https://mail-box-piyush-default-rtdb.firebaseio.com/emails/${mail.id}.json`,
          {
            ...mail,
          }
        )
      );

      await Promise.all(updatedPromises);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={onDeleteHandler}>
        Delete
      </Button>

      <ListGroup variant="flush" className="overflow-auto">
        {filteredMails.map((mail) => (
          <div key={mail.id}>
            <p>{mail.subject}</p>
            <p>{mail.emailContent}</p>
          </div>
        ))}
      </ListGroup>
    </div>
  );
};

export default Inbox;

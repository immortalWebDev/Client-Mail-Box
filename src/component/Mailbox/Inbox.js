import { ListGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import MailList from "./MailList";
import { moveFromInbox} from "../../store/mailSlice";


const Inbox = () => {
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.mail.isLoading);
  const email = useSelector((state) => state.auth.email);
  const filteredMails = mails.filter(
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
     
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
    <div className="">
      <div className="border-bottom d-flex align-items-center mt-lg-0">
        
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
          
        </div>
      ) : filteredMails.length === 0 ? (
        <p className="text-center">Inbox is empty</p>
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

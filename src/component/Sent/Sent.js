import { ListGroup } from "react-bootstrap";
import MailList from "../Mailbox/MailList";
import { useSelector } from "react-redux";

const Sent = () => {
  
  const mails = useSelector((state) => state.mail.mails);
  const email = useSelector((state) => state.auth.email);

  const sentMails = mails.filter(
    (mail) => !mail.isTrashed && mail.sender === email
  );

  return (
    <>
      <div className="border-bottom d-flex">
        <div className="ms-auto"></div>
      </div>
      {sentMails.length === 0 ? (
        <>
          <p className="text-center mt-4 fw-bold fs-7">Sent is empy</p>
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

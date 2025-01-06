// import { Modal, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal"
import Button from "react-bootstrap/Button"

const ConfirmationModal = ({show,handleClose,emptyTrashHandler}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirmation needed!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete these messages permanently? You will not
        be able to see them back ever again!
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button className="rounded-2" onClick={handleClose}>
          No wait
        </Button>
        <Button className="rounded-2" onClick={emptyTrashHandler}>
          Yes Delete it!
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;

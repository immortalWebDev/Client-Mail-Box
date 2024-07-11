import { Modal, Button } from "react-bootstrap";

const ConfirmationModal = (props) => {
  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
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
        <Button className="rounded-2" onClick={props.handleClose}>
          No wait
        </Button>
        <Button className="rounded-2" onClick={props.emptyTrashHandler}>
          Yes Delete it!
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;

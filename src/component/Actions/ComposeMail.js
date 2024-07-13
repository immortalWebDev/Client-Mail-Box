import axios from "axios";
import { Editor } from "react-draft-wysiwyg";
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useRef, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";

import { useSelector, useDispatch } from "react-redux";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
import { addToInbox } from "../../store/mailSlice";

const ComposeMail = () => {
  const toRef = useRef();
  const subjectRef = useRef();
  const senderEmail = useSelector((state) => state.auth.email);
  const email = senderEmail.replace(/[.]/g, "");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const handleEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const onSubmitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const to = toRef.current.value;
    const mailSubject = subjectRef.current.value;

    const editorContent = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );

    const timestamp = new Date().getTime();

    const emailInfo = {
      recipient: to,
      subject: mailSubject,
      emailContent: editorContent,
      sender: senderEmail,
      isRead: false,
      isTrashed: false,
      starred: false,
      timestamp: timestamp,
    };

    if (emailInfo.recipient !== emailInfo.sender) {
    try {
      const url1 =
        "https://mail-box-piyush-default-rtdb.firebaseio.com/emails.json";
      const url2 = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

      const requests = [
        axios.post(url1, emailInfo),
        axios.post(url2, emailInfo),
      ];

      const responses = await Promise.all(requests);
      const [response1, response2] = responses;
      const { status: status1 } = response1;
      const { data, status: status2 } = response2;

      if (status1 === 200 && status2 === 200) {
        const mailItem = {
          id: data.name,
          isChecked: false,
          ...emailInfo,
        };

        dispatch(addToInbox([mailItem]));
          dispatch(
            showNotification({ message: "Email Sent", variant: "success" })
          );
      }
    } catch (error) {
      console.error(error.message);
        dispatch(
          showNotification({
            message: "Failed to send, Try again later",
            variant: "danger",
          })
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("The address you are sending email to is currently logged in!");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmitHandler} className="p-3 mt-4">
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
          <Form.Control type="email" placeholder="Email" ref={toRef} required />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">Subject</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Sub"
            ref={subjectRef}
            required
          />
        </InputGroup>
        <Form.Group className="mb-3" controlId="textEditor">
          <Editor
            editorState={editorState}
            toolbarClassName="py-3 border-bottom bg-light"
            wrapperClassName="card"
            editorClassName="card-body pt-0"
            onEditorStateChange={handleEditorStateChange}
          />
        </Form.Group>
        <div>
          <Button type="submit">Send</Button>
        </div>
      </Form>
    </>
  );
};

export default ComposeMail;

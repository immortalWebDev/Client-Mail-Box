import React, {useEffect, useRef, useState,Suspense } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import LoadingSpinner from "../userInterface/LoadingSpinner";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { useSelector, useDispatch } from "react-redux";
import { showNotification } from "../../store/authSlice";
import axios from "axios";
import { addToInbox } from "../../store/mailSlice";

const LazyEditor = React.lazy(() => import('react-draft-wysiwyg').then((module) => ({
  default:module.Editor
})))

const ComposeMail = () => {
  const toRef = useRef();
  const subjectRef = useRef();
  const senderEmail = useSelector((state) => state.auth.email);
  // const email = senderEmail.replace(/[.]/g, "");
  const email = senderEmail ? senderEmail.replace(/[.]/g, "") : undefined;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();


  useEffect(() => {
    // Dynamically load the CSS insted upfront
    import("react-draft-wysiwyg/dist/react-draft-wysiwyg.css");
  }, []);


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
        const url1 = `${process.env.REACT_APP_FIREBASE_URL}/emails.json`;
        const url2 = `${process.env.REACT_APP_FIREBASE_URL}/sent-emails/${email}.json`;

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
      <Form onSubmit={onSubmitHandler} className="py-4 px-2 compose-mail"> 
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon1">To</InputGroup.Text>
          <Form.Control
            type="email"
            placeholder="Enter receivers Email id"
            ref={toRef}
            required
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="basic-addon2">Subject</InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Enter the topic of your mail"
            ref={subjectRef}
            required
          />
        </InputGroup>
        <Form.Group className="mb-3" controlId="textEditor">
          <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{ height: "343px" }}><LoadingSpinner/></div>}>
          <LazyEditor
            editorState={editorState}
            toolbarClassName="py-3 border-bottom bg-light"
            wrapperClassName="card"
            editorClassName="card-body pt-0"
            editorStyle={{ minHeight: "15rem" }}
            onEditorStateChange={handleEditorStateChange}
          />
          </Suspense>
        </Form.Group>
        <div>
          <Button type="submit" className="rounded-1 px-4">
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ComposeMail;

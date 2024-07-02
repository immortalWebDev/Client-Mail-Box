import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { login } from "../../store/authSlice";

const SignUp = () => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [signIn, setSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false); 

  const history = useHistory();
  const apiKey = useSelector((state) => state.auth.apiKey);

  const onClickHandler = () => {
    setSignIn(!signIn);
  };

  const endPointUrl = signIn
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      
      if (signIn) {
        
        setIsLoading(true);
        const response = await axios.post(endPointUrl, {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        });
        const data = response.data;
        loginHandler(data);
      } else {
        
        if (enteredPassword !== enteredConfirmPassword) {
          // Passwords don't match
          return;
        }
        setIsLoading(true);
        const response = await axios.post(endPointUrl, {
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        });
        const message =
          "Hey Welcome! Your account is created successfully, Login to proceed!";
        alert(message); 
        setIsLoading(false);
        setSignIn(true); 
      }
    } catch (error) {
      alert("Error occurred. Please try again."); 
      setIsLoading(false);
    }
  };

  const loginHandler = (data) => {
    login({ idToken: data.idToken, email: data.email });
    history.replace("/Sidebar/inbox");
  };

  const emailInputHandler = (event) => {
    setEnteredEmail(event.target.value);
  };

  const passwordInputHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  const confirmPasswordInputHandler = (event) => {
    setEnteredConfirmPassword(event.target.value);
  };

  return (
    <>
      <Container fluid>
        <Row className="min-vh-100 align-items-center">
          <Col md={6}>
            <div className="text-center pb-4">
              <h3>
                {signIn ? (
                  <>
                    Login to <span className="text-primary">Mail Express</span>
                  </>
                ) : (
                  <>
                    Sign Up for <span className="text-primary">Mail Express</span>
                  </>
                )}
              </h3>
            </div>
            <Form
              onSubmit={onSubmitHandler}
              className="p-4 shadow-lg mx-auto"
            >
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  onChange={emailInputHandler}
                  value={enteredEmail}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  onChange={passwordInputHandler}
                  value={enteredPassword}
                  required
                />
              </Form.Group>
              {!signIn && (
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    onChange={confirmPasswordInputHandler}
                    value={enteredConfirmPassword}
                    required
                  />
                </Form.Group>
              )}
              <div className="text-center mt-4">
                <Button
                  type="submit"
                  className="w-100 mt-2 rounded-3 border-2 text-white fw-bold"
                >
                  {isLoading ? (signIn ? "Logging in..." : "Signing up...") : (signIn ? "Login" : "Sign Up")}
                </Button>
              </div>
              <div className="pt-3 text-center">
                <span
                  onClick={onClickHandler}
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                >
                  {signIn ? "Create an account" : "Back to login"}
                </span>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default SignUp;

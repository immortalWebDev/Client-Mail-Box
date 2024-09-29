import {
  Form,
  Button,
  FloatingLabel,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../store/authSlice";
import { showNotification } from "../../store/authSlice";
import { setIsLoading } from "../../store/authSlice";
import Notification from "../userInterface/Notification";

const SignUp = () => {
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const isLoading = useSelector((state) => state.auth.isLoading);
  const apiKey = useSelector((state) => state.auth.apiKey);
  const { message, variant } = useSelector((state) => state.auth.notification);

  const dispatch = useDispatch();
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
      if (
        !signIn &&
        (emailHasError || passwordHasError || confirmPasswordHasError)
      )
        return;
      if (emailHasError || passwordHasError) return;
      dispatch(setIsLoading(true));

      const response = await axios.post(endPointUrl, {
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true,
      });
      const data = response.data;
      if (response.status === 200) {
        if (signIn) {
          dispatch(login({ idToken: data.idToken, email: data.email }));
          history.replace("/Sidebar");
        } else {
          const message =
            "Hey Welcome! Your account is created successfully, Login to proceed!";
          dispatch(showNotification({ message: message, variant: "success" }));
        }
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

  const emailBlurHandler = () => {
    setEmailTouched(true);
  };

  const emailHasError = !enteredEmail.includes("@") && emailTouched;

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
                {emailHasError && (
                  <p className="text-danger">Please enter a valid Email</p>
                )}
              </FloatingLabel>

              <FloatingLabel
                className="mb-3"
                controlId="floatingPassword"
                label="Enter password"
              >
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  onChange={passwordInputHandler}
                  value={enteredPassword}
                  required
                />
              </Form.Group>
              {!signIn && (
                <FloatingLabel
                  controlId="floatingConfirmPassword"
                  label="Confirm password"
                >
                  <Form.Control
                    className={`border-0 border-bottom ${
                      confirmPasswordHasError ? "border-danger" : ""
                    } rounded-1`}
                    type="password"
                    placeholder="Confirm password"
                    onChange={confirmPasswordInputHandler}
                    onBlur={confirmPasswordBlurHandler}
                    value={enteredConfirmPassword}
                    required
                  />
                  {confirmPasswordHasError && (
                    <p className="text-danger">
                      Your passwords do not match, Try again
                    </p>
                  )}
                </FloatingLabel>
              )}
              <div className="text-center mt-4">
                {signIn ? (
                  <Button
                    type="submit"
                    className={`w-100 mt-2 rounded-3 border-2 text-white fw-bold`}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                ) : (
                <Button
                  type="submit"
                  className="w-100 mt-2 rounded-3 border-2 text-white fw-bold"
                >
                  {isLoading ? (signIn ? "Logging in..." : "Signing up...") : (signIn ? "Login" : "Sign Up")}
                </Button>
              </div>
              <div className="pt-3 text-center">
                <span>
                  {!signIn ? (
                    <>
                      Continue with existing account{" "}
                      <i className="bi bi-arrow-bar-right"></i>
                    </>
                  ) : (
                    <>
                      Click to create a new account{" "}
                      <i className="bi bi-arrow-bar-right"></i>
                    </>
                  )}{" "}
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

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
  const history = useHistory();

  const onClickHandler = () => {
    setSignIn(!signIn);
  };

  const endPointUrl = signIn
    ? `${process.env.REACT_APP_SINGIN_URL}${apiKey}`
    : `${process.env.REACT_APP_SINGUP_URL}${apiKey}`;

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
      // const { data } = error.response;

      // const { message } = data.error;
      // dispatch(showNotification({ message: message, variant: "danger" }));

      if (!error.response) {
        // Handle the case where error.response is undefined
        dispatch(
          showNotification({
            message:
              "Could not connect. Please check your internet connection and try again.",
            variant: "danger",
          })
        );
      } else {
        const { data } = error.response;
        const { message } = data.error;
        if (message === "INVALID_LOGIN_CREDENTIALS") {
          dispatch(
            showNotification({
              message: "You have entered invalid credentials!",
              variant: "danger",
            })
          );
        }
      }
    } finally {
      dispatch(setIsLoading(false));
    }
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

  const passwordBlurHandler = () => {
    setPasswordTouched(true);
  };

  const passwordHasError = enteredPassword.length < 8 && passwordTouched;

  const confirmPasswordInputHandler = (event) => {
    setEnteredConfirmPassword(event.target.value);
  };

  const confirmPasswordBlurHandler = () => {
    setConfirmPasswordTouched(true);
  };

  const confirmPasswordHasError =
    enteredConfirmPassword !== enteredPassword && confirmPasswordTouched;

  return (
    <>
      <Container fluid>
        <Row className="min-vh-100 align-items-center">
          {message && (
            <div className="fixed-top p-0">
              {" "}
              <Notification message={message} variant={variant} />{" "}
            </div>
          )}
          <Col md={6} className="d-none d-md-block ml-5 signup-cartoon">
            <img
              src="https://cdn.jsdelivr.net/gh/immortalWebDev/my-cdn@d811aeb0f5ed6128c7380e47c9d57a951f604063/mail-express/Mail-Express.jpg"
              alt="Email"
              className="img-fluid"
            />
          </Col>
          <Col md={6}>
            <div className="text-center pb-4">
              <h3>
                {!signIn ? (
                  <>
                    Start your{" "}
                    <i className="text-primary bi-envelope-open-heart"> </i>{" "}
                    with{" "}
                    <i className="text-primary fw-bold">
                      Mail Express <i className="bi-envelope me-2"></i>
                    </i>
                  </>
                ) : (
                  <span>
                    Heyy glad to <i className="text-primary fw-bold">see you</i>{" "}
                    again <i className="bi bi-emoji-smile text-primary"></i>
                  </span>
                )}
              </h3>
            </div>

            <div className="text-center bg-gradient mx-auto py-1 paper-plane-signup">
              <i className="bi-send fs-1 text-white"></i>
            </div>
            <Form
              onSubmit={onSubmitHandler}
              className="p-4 shadow-lg mx-auto signup-form-container"
            >
              <FloatingLabel
                controlId="floatingInput"
                label="Enter email"
                className="mb-3"
              >
                <Form.Control
                  className={`border-0 border-bottom ${
                    emailHasError ? "border-danger" : ""
                  } rounded-1`}
                  type="email"
                  placeholder="Enter email"
                  onChange={emailInputHandler}
                  onBlur={emailBlurHandler}
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
                  className={`border-0 ${
                    passwordHasError ? "border-danger" : ""
                  } border-bottom rounded-1`}
                  type="password"
                  placeholder="Enter password"
                  onBlur={passwordBlurHandler}
                  onChange={passwordInputHandler}
                  value={enteredPassword}
                  required
                />
                {passwordHasError && signIn && (
                  <p className="text-danger">Enter valid password to login </p>
                )}
                {passwordHasError && !signIn && (
                  <p className="text-danger">
                    Password length should be minimum 8 characters{" "}
                  </p>
                )}
              </FloatingLabel>
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
                    className={`w-100 mt-2 rounded-3 border-2 text-white fw-bold`}
                  >
                    {isLoading ? "Signing up..." : "Sign Up"}
                  </Button>
                )}
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
                    className="text-primary switch-log-sign"
                  >
                    {" "}
                    {!signIn ? "Login" : "Sign Up"}
                  </span>{" "}
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

import { useEffect, useMemo, lazy, Suspense, useState } from "react";
import SignUp from "./component/userAuth/SignUp";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import { addToInbox, clearInbox } from "./store/mailSlice";
import useFetch from "./hooks/useFetch";
import LoadingSpinner from "./component/userInterface/LoadingSpinner";
import { getToken } from "./firebaseHelper";
import { logout } from "./store/authSlice";
import { showNotification } from "./store/authSlice";

const LazySidebar = lazy(() => import("./Pages/Sidebar"));

function App() {
  const dispatch = useDispatch();
  const history = useHistory();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);
  const token = useSelector((state) => state.auth.idToken);
  const tokenExpiry = useSelector((state) => state.auth.tokenExpiry);
  const mails = useSelector((state) => state.mail.mails);

  const { fetchData } = useFetch();
  const email = isAuthenticated
    ? recipientMail
      ? recipientMail.replace(/[.]/g, "")
      : undefined
    : undefined;

  const [validToken, setValidToken] = useState(null);

  // Function to validate or refresh the token
  const checkToken = async () => {
    if (token && Date.now() < tokenExpiry) {
      return token; // Token is still valid
    } else {
      return await getToken(); // Refresh the token if expired
    }
  };

  // Fetch a valid token when the user is authenticated
  useEffect(() => {
    const fetchValidToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await checkToken();
          setValidToken(token); // Set the valid token in state
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };

    fetchValidToken();
  }, [isAuthenticated, token, tokenExpiry]);

  // Construct URLs with the valid token
  const url1 = useMemo(
    () =>
      validToken
        ? `${import.meta.env.VITE_FIREBASE_URL}/emails.json?auth=${validToken}`
        : null,
    [validToken]
  );
  const url2 = useMemo(
    () =>
      validToken && email
        ? `${
            import.meta.env.VITE_FIREBASE_URL
          }/sent-emails/${email}.json?auth=${validToken}`
        : null,
    [validToken, email]
  );

  const urls = useMemo(() => (url1 && url2 ? [url1, url2] : []), [url1, url2]);

  // Fetch emails when the recipientMail and validToken are available
  useEffect(() => {
    const onSuccess = (responses) => {
      const receivedMails = responses[0]?.data;
      const sentMails = responses[1]?.data;

      let inboxMails = [];
      if (receivedMails) {
        const entries = Object.entries(receivedMails);
        const filteredEntries = entries.filter(([key, mail]) => {
          return mail.recipient === recipientMail;
        });
        inboxMails = filteredEntries.map(([key, mail]) => ({
          ...mail,
          id: key,
          isChecked: false,
        }));
      }

      let sentMailItems = [];
      if (sentMails) {
        const entries = Object.entries(sentMails);
        sentMailItems = entries.map(([key, mail]) => ({
          ...mail,
          id: key,
          isChecked: false,
        }));
      }

      const allMails = [...sentMailItems, ...inboxMails];
      dispatch(addToInbox(allMails));
    };

    if (recipientMail && validToken) {
      fetchData(urls, "GET", null, onSuccess);
    }

    return () => {
      dispatch(clearInbox());
    };
  }, [recipientMail, validToken, dispatch, fetchData, urls]);

  // Periodically fetch new emails
  useEffect(() => {
    const onSuccess = (response) => {
      const data = response.data;
      const arr = [];
      for (const key in data) {
        const mailItem = {
          ...data[key],
          id: key,
          isChecked: false,
        };
        if (mailItem.recipient === recipientMail) {
          arr.push(mailItem);
        }
      }
      arr.forEach((mail) => {
        if (!mails.some((email) => email.id === mail.id)) {
          dispatch(addToInbox([mail]));
        }
      });
    };

    const interval = setInterval(() => {
      if (Date.now() < tokenExpiry) {
        // console.log(recipientMail)
        // console.log(validToken)
        // console.log(tokenExpiry);
        // console.log(url1);
        // console.log("Token is valid");
        fetchData(url1, "GET", null, onSuccess);
      } else {
        //   window.location.reload()
        clearInterval(interval); // Prevent multiple logouts
        dispatch(logout());
        history.replace("/auth");

        if (!localStorage.getItem("manualLogout")) {
          dispatch(
            showNotification({
              message: "Session expired, Please login again",
              variant: "info",
            })
          );
          localStorage.removeItem("manualLogout");
          console.log("Session expired. Please Login again");
        }
      }
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [
    fetchData,
    recipientMail,
    mails,
    dispatch,
    url1,
    url2,
    validToken,
    tokenExpiry,
  ]);

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/auth" />
      </Route>
      <Route path="/auth">
        <SignUp />
      </Route>
      {isAuthenticated && (
        <Route path="/Sidebar">
          <Suspense
            fallback={
              <span className="d-flex justify-content-center align-items-center vh-100">
                <LoadingSpinner />
              </span>
            }
          >
            <LazySidebar />
          </Suspense>
        </Route>
      )}
      {!isAuthenticated ? (
        <Redirect from="*" to="/auth" />
      ) : (
        <Redirect from="*" to="/Sidebar/inbox" />
      )}
    </Switch>
  );
}

export default App;

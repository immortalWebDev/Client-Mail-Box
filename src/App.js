import { useEffect, useMemo } from "react";
import SignUp from "./component/userAuth/SignUp";
import Sidebar from "./Pages/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { addToInbox, clearInbox } from "./store/mailSlice";
import useFetch from "./hooks/useFetch";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);

  const { fetchData } = useFetch();
  const email = isAuthenticated ? recipientMail.replace(/[.]/g, "") : undefined;
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();

  const url1 = `${process.env.REACT_APP_FIREBASE_URL}/emails.json`;
  const url2 = `${process.env.REACT_APP_FIREBASE_URL}/sent-emails/${email}.json`;

  const urls = useMemo(() => [url1, url2], [url1, url2]);

  useEffect(() => {
    const onSuccess = (responses) => {
      const receivedMails = responses[0]?.data;
      const sentMails = responses[1]?.data;

      let inboxMails;
      if (receivedMails) {
        const entries = Object.entries(receivedMails);
        const filteredEntries = entries.filter(([key, mail]) => {
          return mail.recipient === recipientMail;
        });
        inboxMails = filteredEntries.map(([key, mail]) => {
          return {
            ...mail,
            id: key,
            isChecked: false,
          };
        });
      } else {
        inboxMails = [];
      }

      let sentMailItems;
      if (sentMails) {
        const entries = Object.entries(sentMails);
        sentMailItems = entries.map(([key, mail]) => {
          return {
            ...mail,
            id: key,
            isChecked: false,
          };
        });
      } else {
        sentMailItems = [];
      }

      const allMails = [...sentMailItems, ...inboxMails];
      dispatch(addToInbox(allMails));
    };

    if (recipientMail) {
      fetchData(urls, "GET", null, onSuccess);
    }

    return () => {
      dispatch(clearInbox());
    };
  }, [recipientMail, dispatch, fetchData, urls]);

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
      if (recipientMail) {
        fetchData(url1, "GET", null, onSuccess);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [fetchData, recipientMail, mails, dispatch, url1, url2]);

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
          <Sidebar />
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

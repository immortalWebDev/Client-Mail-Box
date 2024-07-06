import { useEffect } from "react";
import SignUp from "./component/userAuth/SignUp";
import Sidebar from "./Pages/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { addToInbox} from "./store/mailSlice";
import axios from "axios";

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const recipientMail = useSelector((state) => state.auth.email);
  const email = isAuthenticated ? recipientMail.replace(/[.]/g, "") : undefined;
  const mails = useSelector((state) => state.mail.mails);
  const dispatch = useDispatch();

  const url1 = "https://mail-box-piyush-default-rtdb.firebaseio.com/emails.json";
  const url2 = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

  useEffect(() => {
    const fetchData = async () => {


      try {
        const responses = await Promise.all([
          axios.get(url1),
          axios.get(url2),
        ]);

        const receivedMails = responses[0]?.data ?? {};
        const sentMails = responses[1]?.data ?? {};

        const inboxMails = Object.entries(receivedMails)
          .filter(([key, mail]) => mail.recipient === recipientMail)
          .map(([key, mail]) => ({
            ...mail,
            id: key,
            isChecked: false,
          }));

        const sentMailItems = Object.entries(sentMails)
          .map(([key, mail]) => ({
            ...mail,
            id: key,
            isChecked: false,
          }));

        const allMails = [...sentMailItems, ...inboxMails];

        dispatch(addToInbox(allMails));
      } catch (error) {
        console.log("Error fetching mails:", error);
      } 
    };

    if (recipientMail) {
      fetchData();
    }
  }, [recipientMail, dispatch, url1, url2]);

  useEffect(() => {
    const fetchSentMails = async () => {
      const url = `https://mail-box-piyush-default-rtdb.firebaseio.com/sent-emails/${email}.json`;

      try {
        const response = await axios.get(url);
        const data = response.data;

        const newMails = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          isChecked: false
        }));

        newMails.forEach((mail) => {
          if (!mails.some((email) => email.id === mail.id)) {
            dispatch(addToInbox([mail]));
          }
        });
      } catch (error) {
        console.error('Error fetching sent mails:', error);
      }
    };

   fetchSentMails()
   const interval = setInterval(fetchSentMails, 2000);
    return () => clearInterval(interval);
    
  }, [dispatch, recipientMail, email, mails]);

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
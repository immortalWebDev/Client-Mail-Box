import React from 'react';
import { Route } from 'react-router-dom';
import ComposeMail from '../Actions/ComposeMail';
import Inbox from '../Actions/Inbox'
import Message from '../Actions/Message'
import Sent from '../Sent/Sent'
import Trash from '../Trash/Trash'
import Starred from '../Starred/Starred'
import { useSelector } from 'react-redux';

const MailRoutes = () => {

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  
  if (!isAuthenticated) {
    // Redirect unauthenticated users to the login page
    return <Redirect to="/auth" />;
  }

  return (
    <>
      <Route path="/Sidebar/ComposeMail">
        {<ComposeMail />}
      </Route>
      <Route path="/Sidebar/inbox" exact>
        <Inbox />
      </Route>
      <Route path="/Sidebar/trash" exact>
        <Trash />
      </Route>
      <Route path="/Sidebar/sent" exact>
        <Sent />
      </Route>
      <Route path="/Sidebar/starred" exact>
        <Starred />
      </Route>
      <Route path="/Sidebar/starred/:messageId">
        <Message />
      </Route>
      <Route path="/Sidebar/sent/:messageId">
        <Message />
      </Route>
      <Route path="/Sidebar/inbox/:messageId">
        <Message />
      </Route>
      <Route path="/Sidebar/trash/:messageId">
        <Message />
      </Route>
    </>
  );
};

export default MailRoutes;

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const WelcomeLand = () => {

  const history = useHistory()

  const handleContactClick = () => {
    window.location.href = 'mailto:pgbadgujar007@gmail.com';
  };

  const handleComposeClick = () => {
    history.replace('Sidebar/ComposeMail')
  }

  return (
    <Container className="mt-3">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card >
            <Card.Body style={{border: 'solid 1px deepskyblue' , borderRadius: '10px'}}>
              <Card.Title className="text-center mb-4 fw-bold fs-4">Mail Express in a nutshell</Card.Title>
              <Card.Text>
                Mail Express is your comprehensive in-app email service, designed to simplify your communication needs. Whether you're managing personal messages or business correspondence, Mail Express offers a range of features to enhance your experience.
              </Card.Text>
              <ul className="mb-5">
                <li><strong>Compose:</strong> Create and send emails effortlessly with our intuitive composer.</li>
                <li><strong>Inbox:</strong> Organize and manage received emails efficiently.</li>
                <li><strong>Sent Items:</strong> Keep track of all the emails you've sent.</li>
                <li><strong>Starred:</strong> Mark important emails for quick access.</li>
                <li><strong>Trash:</strong> Safely store and retrieve deleted emails.</li>
                <li><strong>Real-time Chat:</strong> Instantly connect with contacts within the app.</li>
                <li><strong>Bulk Actions:</strong> Perform actions on multiple emails at once using dropdown menus.</li>
                <li><strong>Online Status:</strong> Get to know your online status as your network fluctuates.</li>
              </ul>
              <hr/>
              <Card.Text>
                Experience seamless email management directly within your application. Stay tuned for upcoming features that will further enhance your email experience!
              </Card.Text>
              <div className='d-flex justify-content-between'>
              <Button variant="success" onClick={handleContactClick}>Contact Us</Button>
              <Button variant="primary" onClick={handleComposeClick}>Start composing!</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default WelcomeLand;

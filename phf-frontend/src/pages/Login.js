import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Modal from "react-bootstrap/Modal";
import { CDBBtn, CDBIcon } from "cdbreact";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../firebase/AuthContext";
import bgImage from "../assets/loginbg3.webp";
import "./styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  // to /home
  const navigate = useNavigate();

  // auth context
  const { signIn } = UserAuth();

  // login handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      setShow(true);
      setError(error.message);
    }
  };

  // login error pop up
  function ErrorPopUp() {
    if (show) {
      return (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p className="error-text">What went wrong? {error}</p>
        </Alert>
      );
    } else {
      return;
    }
  }

  return (
    <div className="login-container">
      <div className="error-popup">
        <Modal
          show={show}
          size="lg"
        >
          <Modal.Body className="error-modal-body">
            {" "}
            <ErrorPopUp />{" "}
          </Modal.Body>
        </Modal>
      </div>
      <div className="login-bg-wrapper">
        <div
          className="shadow-lg p-3 mb-5 bg-white rounded"
          style={{ width: "35rem", height: "37rem" }}
        >
          <div className="card-background">
            <div className="login-card-wrapper">
              <Form onSubmit={handleSubmit}>
                <Form.Text>
                  {" "}
                  <h1> Welcome Back! </h1>
                </Form.Text>
                <Form.Text>
                  {" "}
                  <h4> Login to continue </h4>
                </Form.Text>
                <Form.Text> &nbsp; </Form.Text>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Your Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Your Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </Form.Group>
                <Form.Text> &nbsp; </Form.Text>
                <div className="login-buttons">
                  <button class="reg-login" type="submit">
                    {" "}
                    Press to Login{" "}
                  </button>
                  <button class="log" type="submit" href="/forgot">
                    {" "}
                    Forgot Password{" "}
                  </button>
                </div>
                <Form.Text> &nbsp; </Form.Text>
                <div className="login-seperate">
                  ___________________________________&nbsp; &nbsp; OR &nbsp;
                  &nbsp; ___________________________________
                </div>
                <Form.Text> &nbsp; </Form.Text>
                <div className="other-login-buttons">
                  <CDBBtn
                    flat
                    color="dark"
                    className="p-3"
                    href="https://www.instagram.com/clee.99/"
                  >
                    <CDBIcon fab icon="google" /> &nbsp; Continue with Google &nbsp; <b>NW-TBD</b>
                  </CDBBtn>
                  <Form.Text> &nbsp; </Form.Text>
                  <CDBBtn
                    flat
                    color="dark"
                    className="p-3"
                    href="https://www.instagram.com/clee.99/"
                  >
                    <CDBIcon fab icon="github" /> &nbsp; Contiunue with GitHub &nbsp; <b>NW-TBD</b>
                  </CDBBtn>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="login-img">
          <img
            className="shadow-lg rounded"
            src={bgImage}
            alt="project helper function sign in"  
            style={{ width: "35rem", height: "37rem" }}
          />
        </div>
      </div>
    </div>
  );
}

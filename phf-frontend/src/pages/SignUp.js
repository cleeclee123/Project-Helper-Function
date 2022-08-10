import React, { useState } from "react";
import { UserAuth } from "../firebase/AuthContext";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { CDBBtn, CDBIcon } from "cdbreact";
import bgImage from "../assets/mask_totem_smoke_192795_3840x2160.jpg";
import "./styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // auth context
  const { createUser } = UserAuth();

  // redirect to home
  const navigate = useNavigate();

  // submit/create user handler
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      navigate("/home");
      await createUser(name, email, password);
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className="login-container">
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
                  <h1> Welcome! </h1>
                </Form.Text>

                <Form.Group className="mb-3">
                  <Form.Label>Your Full Name</Form.Label>
                  <Form.Control
                    placeholder="Enter your name"
                    onChange={(event) => setName(event.target.value)}
                  />
                </Form.Group>

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
                <div className="login-buttons">
                  <button class="reg-login" type="submit">
                    {" "}
                    Press to Sign Up{" "}
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
                    <CDBIcon fab icon="google" /> &nbsp; Continue with Google
                  </CDBBtn>
                  <Form.Text> &nbsp; </Form.Text>
                  <CDBBtn
                    flat
                    color="dark"
                    className="p-3"
                    href="https://www.instagram.com/clee.99/"
                  >
                    <CDBIcon fab icon="github" /> &nbsp; Contiunue with GitHub
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
            style={{ width: "35rem", height: "37rem" }}
          />
        </div>
      </div>
    </div>
  );
}

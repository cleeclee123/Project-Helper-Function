import React from "react";
import Form from "react-bootstrap/Form";
import { CDBFooter, CDBBox, CDBBtn, CDBIcon } from 'cdbreact';
import bgImage from "../assets/loginbg3.webp";
import "./styles/Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-bg-wrapper">
      <div
        className="shadow-lg p-3 mb-5 bg-white rounded"
        style={{ width: "35rem", height: "37rem" }}
      >
        <div className="card-background">
          <div className="login-card-wrapper">
            <Form>
              <Form.Text> <h1> Welcome Back! </h1></Form.Text>
              <Form.Text> <h4> Login to continue </h4></Form.Text>
              <Form.Text> &nbsp; </Form.Text>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Your Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter your email" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Your Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                />
              </Form.Group>
              <Form.Text> &nbsp; </Form.Text>
              <div className="login-buttons">
                <button class="reg-login" type="submit"> Press to Login  </button>
                <button class="log" type="submit" href="/forgot"> Forgot Password  </button>
              </div>
              <Form.Text> &nbsp; </Form.Text>
              <div className="login-seperate">
                ___________________________________&nbsp; &nbsp; OR &nbsp; &nbsp; ___________________________________
              </div>
              <Form.Text> &nbsp; </Form.Text>
              <div className="other-login-buttons">
                <CDBBtn flat color="dark" className="p-3" href="https://www.instagram.com/clee.99/">
                  <CDBIcon fab icon="google" /> &nbsp; Continue with Google
                </CDBBtn>
                <Form.Text> &nbsp; </Form.Text>
                <CDBBtn flat color="dark" className="p-3" href="https://www.instagram.com/clee.99/">
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

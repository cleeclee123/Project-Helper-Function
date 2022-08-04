import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import CodeImage from "../assets/codeiconphf.png";
import bgImage from "../assets/loginbg3.webp";
import "./styles/Login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="login-bg-wrapper">
      <div
        className="shadow-lg p-3 mb-5 bg-white rounded"
        style={{ width: "35rem", height: "35rem" }}
      >
        <div className="card-background">
          <div className="login-card-wrapper">
            <Form>
              <Form.Text> <h1> Login </h1></Form.Text>
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
                <Form.Text>
                  {" "}
                  <a className="forgotlink" href="/forgot">
                    Forgot Password
                  </a>{" "}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
          <div className="login-img">
            <img
              className="shadow-lg rounded"
              src={bgImage}
              style={{ width: "35rem", height: "35rem" }}
            />
          </div>
      </div>
    </div>
  );
}

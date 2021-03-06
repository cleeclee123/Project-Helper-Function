import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import phfLogo from "../assets/phf-logo-ss-removebg-preview.png";
import "./styles/NavbarComp.css";

export default class NavbarComp extends Component {
  render() {
    return (
      <div className="navbar-wrapper">
        <Navbar className="color-nav" varient="dark" expand="sm">
          <Container>
            <Navbar.Brand href="/" className="nav-title">
              <img className="phf-logo" src={phfLogo} /> &nbsp; 
              Project Helper Function 
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          </Container>
        </Navbar>
      </div>
    );
  }
}

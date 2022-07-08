import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import "./styles/NavbarComp.css";

export default class NavbarComp extends Component {
  render() {
    return (
      <div className="navbar-wrapper">
        <Navbar className="color-nav" varient="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/" className="nav-title">
              Project Helper Function | Christopher Lee | All Rights Reserved
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          </Container>
        </Navbar>
      </div>
    );
  }
}

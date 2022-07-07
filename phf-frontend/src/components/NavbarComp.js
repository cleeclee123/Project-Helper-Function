import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "./styles/NavbarComp.css";

export default class NavbarComp extends Component {
  render() {
    return (
      <div className="navbar-wrapper">
        <Navbar className="color-nav" varient="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#home-id" className="nav-title">Project Helper Function</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="#home-id" className="nav-links">Home</Nav.Link>
                <Nav.Link href="#code-id" className="nav-links">Try It Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

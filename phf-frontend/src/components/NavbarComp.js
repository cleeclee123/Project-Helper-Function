import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import "./NavbarComp.css";

export default class NavbarComp extends Component {
  render() {
    return (
      <div className="navbar-wrapper">
        <Navbar className="color-nav" varient="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/home" className="nav-title">Project Helper Function</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/home" className="nav-links">Home</Nav.Link>
                <Nav.Link href="/about" className="nav-links">About</Nav.Link>
                <Nav.Link href="/code" className="nav-links">Try It Out</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

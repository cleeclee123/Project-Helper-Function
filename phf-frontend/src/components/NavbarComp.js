import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import phfLogo from "../assets/phf-logo-ss-removebg-preview.png";
import "./styles/NavbarComp.css";

function NavScrollExample() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="color-nav">
      <Container fluid>
        <Navbar.Brand href="/"> 
          <img className="phf-logo" src={phfLogo} />
          &nbsp; Project Helper Function
        </Navbar.Brand>
        <Nav>
          <Nav.Link href="/signin"> <button class="log"> Login </button> </Nav.Link> &nbsp;
          <Nav.Link href="/signup"> <button class="reg"> Sign Up </button> </Nav.Link> &nbsp;
          </Nav>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;

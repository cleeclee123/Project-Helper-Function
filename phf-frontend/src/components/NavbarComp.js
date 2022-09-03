import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import phfLogo from "../assets/phf-logo-ss-removebg-preview.png";
import "./styles/NavbarComp.css";

function NavScrollExample() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="color-nav">
      <Container fluid>
        <Navbar.Brand href="/home">
          <img className="phf-logo" src={phfLogo} />
          &nbsp; Project Helper Function
        </Navbar.Brand>

        <Nav>
          <Nav.Link href="/home">
            {" "}
            <button class="reg"> Home </button>{" "}
          </Nav.Link>
          <Nav.Link href="https://docs.google.com/document/d/1ZfFRDnd3BNNShxv60tJXETFf32aAVfhG_fcy6JGVySA/edit?usp=sharing">
            {" "}
            <button class="reg"> Docs </button>{" "}
          </Nav.Link>
          <Nav.Link href="/login">
            {" "}
            <button class="reg"> Login </button>{" "}
          </Nav.Link>
          <Nav.Link href="/signup">
            {" "}
            <button class="log"> Sign Up For More Features! </button>{" "}
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;

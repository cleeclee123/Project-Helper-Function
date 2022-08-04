import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
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
          <Nav.Link href="/Home"> <button class="reg"> Home  </button> </Nav.Link> 
          <Nav.Link href="/docs"> <button class="reg"> Docs  </button> </Nav.Link> 
          <Nav.Link href="/login"> <button class="reg"> Login  </button> </Nav.Link> 
          <Nav.Link href="/signup"> <button class="log"> Sign Up For Free </button> </Nav.Link> 
        </Nav>
          
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;

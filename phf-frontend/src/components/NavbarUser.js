import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import phfLogo from "../assets/phf-logo-ss-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../firebase/AuthContext";
import "./styles/NavbarComp.css";

function NavScrollExample() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      window.location.reload();
      console.log("You are logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="color-nav">
      <Container fluid>
        <Navbar.Brand href="/home">
          <img className="phf-logo" src={phfLogo} />
          &nbsp; Project Helper Function
        </Navbar.Brand>

        <Nav>
          <Nav.Link href="/home">
            <button class="reg"> Home </button>
          </Nav.Link>
          <Nav.Link href="https://docs.google.com/document/d/1ZfFRDnd3BNNShxv60tJXETFf32aAVfhG_fcy6JGVySA/edit?usp=sharing">
            <button class="reg"> Docs </button>
          </Nav.Link>
          <Nav.Link href="/login">
            <button class="reg" onClick={handleLogout}>
              Sign Out
            </button>
          </Nav.Link>
          <Nav.Link href="/dashboard">
            <button class="log"> Go to Dashboard </button>
          </Nav.Link>
          <Nav.Link href="/dashboard">
            <button class="log" >
              Signed in as {user.displayName}
            </button>
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;

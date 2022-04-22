import { useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Container } from "react-bootstrap";

import Logo from "../logo-cosette.svg"

export default function Header(props) {

  const navigate = useNavigate();

  const logoStyle = {
    marginLeft: "1.5vw",
    marginRight: "0.5vw",
    width: "2rem",
    height: "2rem",
  }

  const handleClickBrand = e => {
    e.preventDefault();
    navigate("/");
  }

  return (
    <>
      <Navbar bg="light" sticky="top" expand="lg" style={{alignSelf: "stretch", zIndex: 1}}>
        <Container fluid>
          <Navbar.Brand href="#" onClick={handleClickBrand}>
            <img alt="logo" src={Logo} className="align-top" style={logoStyle} />
            Cosette
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link onClick={() => navigate("/")}> 
                Home
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/templates")}>
                Templates
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/tutorial")}>
                Tutorial
              </Nav.Link>
              <Nav.Link onClick={() => navigate("/about")}>
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>    
    </>
  );
}
import { Navbar, Nav, Container } from "react-bootstrap";
import logo from "../media/logo.png";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useCartContext } from "../providers/CartProvider";
import "./HeaderMenu.css";
import axios from "axios";

export const statusContext = React.createContext();

const HeaderMenu = () => {
  const [status, setStatus] = useState({ isLoggedIn: false, user: null });
  const { cartItems } = useCartContext();

  const Logout = async () => {
    await axios.post("/api/auth/logout").then(() => {
      window.location = "/signin";
    });
  };

  useEffect(() => {
    axios.get("/api/auth/user").then((res) => setStatus(res.data));
  }, []);

  return (
    <Navbar collapseOnSelect expand="md" bg="light" variant="light">
      <Container>
        <Navbar.Brand href="/">
          <img src={logo} alt="pawsup_logo" className="navbar_logo_img" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto flex-fill">
            {status.isLoggedIn ? (
              <Nav.Link onClick={Logout}>Logout</Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/signin">
                Login/Signup
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/service">
              Service
            </Nav.Link>
            <Nav.Link as={Link} to="/product">
              Product
            </Nav.Link>
            <div className="flex-fill">
              <Nav.Link as={Link} to="/media" className="social-link">
                Social
              </Nav.Link>
            </div>
            {status.isLoggedIn && (
              <Nav.Link as={Link} to="/cart">
                Cart ({cartItems.products.length + cartItems.services.length})
              </Nav.Link>
            )}
            {status.isLoggedIn && (
              <Nav.Link as={Link} to="/realaccountpage">
                {status.user.username}
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default HeaderMenu;

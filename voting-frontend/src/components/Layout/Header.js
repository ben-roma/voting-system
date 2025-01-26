// Header.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="p-3">
      <Navbar.Brand as={Link} to="/">
        <img
          src="/images/logo.webp"
          alt="Logo"
          className="header-logo"
          style={{ width: '50px', marginRight: '10px' }}
        />
        Système de Vote Électronique Gabonais
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
          <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
          <Nav.Link as={Link} to="/results">Résultats</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;

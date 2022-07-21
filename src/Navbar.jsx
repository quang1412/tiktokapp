import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light position-absolute w-100" style={{ 'zIndex':'1' }}>
  <div className="container-fluid">
    <Link to="/" className="navbar-brand">Home</Link>
    <button className="navbar-toggler"type="button" data-mdb-toggle="collapse" data-mdb-target="#navbarNav" 
      aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <i className="fas fa-bars"></i>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav"> 
        <li className="nav-item">
          <Link to="/alertbox" className="nav-link">Alertbox</Link>
        </li> 
        <li className="nav-item">
          <Link to="/live-reaction-bot" className="nav-link">Live Reaction Bot</Link>
        </li> 
        <li className="nav-item">
          <Link to="/top-like" className="nav-link">Top Like</Link>
        </li> 
      </ul>
    </div>
  </div>
</nav> 
  );
}

export default Navbar;
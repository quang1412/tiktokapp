import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light position-absolute w-100" style={{ 'zIndex':'1' }}>
  <div className="container-fluid">
    <Link to="/" className="navbar-brand">Home</Link>
    <button
      className="navbar-toggler"
      type="button"
      data-mdb-toggle="collapse"
      data-mdb-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation"
    ><i className="fas fa-bars"></i>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav"> 
        <li className="nav-item">
          <Link to="/alertbox" className="nav-link">Alertbox</Link>
        </li> 
      </ul>
    </div>
  </div>
</nav>
    
    
    // <nav>
    //   <ul>
    //     <li>
    //       <Link to="/">Home</Link>
    //     </li>
    //     <li>
    //       <Link to="/blogs">Blogs</Link>
    //     </li>
    //     <li>
    //       <Link to="/contact">Contact</Link>
    //     </li>
    //   </ul>
    // </nav>
  );
}

export default Navbar;
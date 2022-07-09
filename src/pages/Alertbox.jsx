import React from 'react';
import logo from '../logo.svg';
import '../style/Alertbox.css';

function Alertbox() {
  return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code>
        </p>
        <a
          className="App-link"
          href="javascript:;" 
          rel="noopener noreferrer"
        >
          Alertbox
        </a>
      </header>      
    </div>
  );
}

export default Alertbox;
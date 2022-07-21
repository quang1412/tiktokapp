import React from 'react';
import logo from '../../logo.svg';
import './style.css';

function Home() {
  // document.getElementsByTagName('html')[0].className = "";
  return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code>
        </p>
        <a
          className="App-link"
          href="/"  
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>      
    </div>
  );
}

export default Home;
import React, {useEffect, useState} from 'react';
import logo from '../logo.svg';
import '../style/Alertbox.css';
import { io } from "socket.io-client";

const socket = io("https://tiktoktool.glitch.me");

const Alertbox = () => {
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
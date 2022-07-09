import React, {useEffect, useState} from 'react';
import logo from '../logo.svg';
import '../style/Alertbox.css';
import { io } from "socket.io-client";



const socketConnect = () => {
  let socket = io("https://tiktoktool.glitch.me");
  socket.on('connect', () => {
    console.log('connected')
  })
}

const askId = async () => {
  var id = new URLSearchParams(document.location.search).get("id");
  if(!id){
    id = prompt('Enter tiktok id without "@" (eg: tiktok)', "");
    if (id == null || id == "") {
      return false;
    }
    return window.location.replace(`?id=${id}`)
  }
  return id.trim().replace(' ','').replace('@','').toLowerCase();
}


const Alertbox = () => {
  
  socketConnect();
  
  return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code>
        </p>
        <a className="App-link" href="/" rel="noopener noreferrer"> Alertbox </a>
      </header>
    </div>
  );
}

export default Alertbox;
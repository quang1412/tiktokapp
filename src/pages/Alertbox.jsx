import React, {useEffect, useState} from 'react';
import logo from '../logo.svg';
import '../style/Alertbox.css';
import { io } from "socket.io-client";

const [log, changeLog] = useState([]);

const socketConnect = () => {
  let socket = io("https://tiktoktool.glitch.me",  {query: `id=dongnguyenchat`});
  socket.on('connect', () => {
    console.log('connected')
  })
}

const Alertbox = () => {
  
  socketConnect();
  
  return (
    <div className="App">
      <div className="layer" id="log" style={{"display":"none"}}>
        {log.map((l, i) => (<p>l</p>))}
      </div>
      <div className="layer" id="play" style={{"display":"none"}}></div>
      <div className="layer" id="setting" style={{"display":"none"}}></div>
    </div>
  );
}

export default Alertbox;
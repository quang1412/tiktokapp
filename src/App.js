import React, { Component, useState, useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { io } from "socket.io-client"; 


// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code>
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>      
//       </div>
//     );
//   }
// }



function App() { 

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('https://tiktoktool.glitch.me')
    
    socketRef.current.on('connect', () => {
      console.log('connect')
    })
  }, []);


  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code>
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>      
      </div>
  );
}


export default App;
 
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
// import * as serviceWorker from './serviceWorker';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Alertbox from "./pages/Alertbox/";
import LiveReactionBot from './pages/LiveReactionBot/';


export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
        </Route>
        <Route path="alertbox" element={<Alertbox />}/>
        <Route path="live-reaction-bot" element={<LiveReactionBot />}/>
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.render(<Main />, document.getElementById("root"));

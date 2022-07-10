import React, {useEffect, useState} from 'react';
// import logo from '../logo.svg';
import '../style/Alertbox.css';
import { io } from "socket.io-client";

const Alertbox = () => {
  const [log, changeLog] = useState([]);
  const {options, setOptions} = useState(JSON.parse(localStorage.alertboxOpts || `{ "share": { "alert_duration": 10, "message_template": "", "alert_animation_out": "backOutDown", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_volume": 100, "alert_animation_in": "backInDown", "layout": "banner", "alert_text_delay": 0, "font_weight": 800, "text_color": "#ffffff", "text_highlight_color": "#32c3a6", "text_animation": "wiggle", "font_size": 64, "active": true, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg" }, "gift": { "text_highlight_color": "#32c3a6", "active": true, "text_animation": "wiggle", "alert_animation_out": "backOutDown", "layout": "banner", "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "alert_animation_in": "backInDown", "alert_duration": 10, "sound_volume": 50, "message_template": "", "font_size": 64, "font_weight": 800, "alert_min_amount": 0, "alert_text_delay": 0 }, "like": { "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/Explosion.gif", "sound_volume": 50, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "font_weight": 800, "alert_animation_out": "backOutDown", "alert_text_delay": 0, "text_highlight_color": "#32c3a6", "alert_animation_in": "backInDown", "text_animation": "wiggle", "layout": "banner", "alert_duration": 10, "font_size": 64, "message_template": "", "active": true }, "general": { "layout": "banner", "alert_parries": false, "parry_alert_delay": 3, "approved_manually": false, "censor_timeout": 0, "background_color": "#80ffac", "alert_delay": 3, "censor_recent_events": true }, "comment": {}, "follow": { "alert_duration": 10, "alert_animation_in": "backInDown", "message_template": "", "alert_animation_out": "backOutDown", "alert_text_delay": 0, "font_size": 64, "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "text_highlight_color": "#32c3a6", "text_color": "#ffffff", "layout": "banner", "sound_volume": 50, "text_animation": "wiggle", "font_weight": 800, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "active": true } }`))
  
  const socketConnect = () => {
    let socket = io("https://tiktoktool.glitch.me",  {query: `id=dongnguyenchat`});
    socket.on('connect', () => {
      // log.push('connected')
      console.log('connected')
    })
  }
  
  // socketConnect();
  
  return (
    <div className="App">
      <div className="layer" id="log" style={{"display":"none"}}>
        {log.map((l, i) => (<p>l</p>))}
      </div>
      <div className="layer" id="play" style={{"display":"none"}}></div>
      <div className="layer" id="setting" style={{"display":"none"}}>
        
      </div>
    </div>
  );
}

export default Alertbox;
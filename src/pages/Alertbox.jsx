import React, {useEffect, useState} from 'react';
import AlertboxOpts from './AlertboxOpts';
import '../style/Alertbox.css';
import '../style/TextAnimations.css';
import { io } from "socket.io-client";

const Alertbox = () => {
  const [log, changeLog] = useState(["log:"]);
  const [currentLayout, setCurrentLayout] = useState("log");
  const [options, setOptions] = useState(JSON.parse(localStorage.alertboxOpts || `{ "share": { "alert_duration": 10, "message_template": "", "alert_animation_out": "backOutDown", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_volume": 100, "alert_animation_in": "backInDown", "layout": "banner", "alert_text_delay": 0, "font_weight": 800, "text_color": "#ffffff", "text_highlight_color": "#32c3a6", "text_animation": "wiggle", "font_size": 64, "active": true, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg" }, "gift": { "text_highlight_color": "#32c3a6", "active": true, "text_animation": "wiggle", "alert_animation_out": "backOutDown", "layout": "banner", "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "alert_animation_in": "backInDown", "alert_duration": 10, "sound_volume": 50, "message_template": "", "font_size": 64, "font_weight": 800, "alert_min_amount": 0, "alert_text_delay": 0 }, "like": { "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/Explosion.gif", "sound_volume": 50, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "font_weight": 800, "alert_animation_out": "backOutDown", "alert_text_delay": 0, "text_highlight_color": "#32c3a6", "alert_animation_in": "backInDown", "text_animation": "wiggle", "layout": "banner", "alert_duration": 10, "font_size": 64, "message_template": "", "active": true }, "general": { "layout": "banner", "alert_parries": true, "parry_alert_delay": 3, "approved_manually": false, "censor_timeout": 0, "background_color": "#80ffac", "alert_delay": 3, "censor_recent_events": true }, "comment": {}, "follow": { "alert_duration": 10, "alert_animation_in": "backInDown", "message_template": "", "alert_animation_out": "backOutDown", "alert_text_delay": 0, "font_size": 64, "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "text_highlight_color": "#32c3a6", "text_color": "#ffffff", "layout": "banner", "sound_volume": 50, "text_animation": "wiggle", "font_weight": 800, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "active": true } }`));
  
  const socketConnect = () => { 
    
    changeLog(prevLog => [...prevLog, 'server connecting...']); 
    let socket = io("https://tiktoktools.glitch.me/obs",  {query: `id=dongnguyenchat`});
    socket.on('connect', () => {  
      changeLog(prevLog => [...prevLog, ...['server connected', 'tiktok connecting...']]);
    }) 
    
    socket.on('ttConnectRetry', i => { 
      changeLog(prevLog => [...prevLog, `trying to connect (${i}/10)`]); 
    });
    
    socket.on('ttRoomInfo', data => {
      console.log('server connected', data);
      changeLog(prevLog => [...prevLog, 'server connected']);
    });
    
    socket.on('ttConnectFail', () => {
      console.log('server connect fail');
      changeLog(prevLog => [...prevLog, 'server connect fail']);
    });
  }
  
  const handleOptions = newOptions => {
    console.log(newOptions)
    setOptions({...options, ...newOptions})
    localStorage.alertboxOpts = JSON.stringify(newOptions)
  }
  
  useEffect(() => {
    socketConnect();
    
    const interval = setInterval(() => {
      changeLog( prevState => {
      const newState = [...prevState]
      newState[newState.length - 1] += '.'
      return newState
    })
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  
  // socketConnect();
  
  return (
    <div className="App">
      <div className="layer text-start" id="log" style={{"display": (currentLayout === "log" ? "block" : "none")}}>
        {log.map(text => (<p class="mb-0">{text}</p>))}
      </div>
      <div className="layer" id="play" style={{"display":(currentLayout === "play" ? "block" : "none")}}></div>
      <div className="layer" id="setting" style={{"display":(currentLayout === "setting" ? "block" : "none")}}>
        <AlertboxOpts opts={options} onChangeOptions={handleOptions}/>
      </div>
    </div>
  );
}

export default Alertbox;
import React, {useEffect, useState, useRef} from 'react';
import AlertboxOpts from './AlertboxOpts';
import '../style/Alertbox.css';
import '../style/TextAnimations.css';
import { io } from "socket.io-client";

const Alertbox = () => {
  const isLoading = useRef(false);
  const [layer, setLayer] = useState("log");
  const [log, changeLog] = useState(["log:"]);
  const [eventQueue, setEventQueue] = useState([])
  const [options, setOptions] = useState(JSON.parse(localStorage.alertboxOpts || `{ "share": { "alert_duration": 10, "message_template": "", "alert_animation_out": "backOutDown", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_volume": 100, "alert_animation_in": "backInDown", "layout": "banner", "alert_text_delay": 0, "font_weight": 800, "text_color": "#ffffff", "text_highlight_color": "#32c3a6", "text_animation": "wiggle", "font_size": 64, "active": true, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg" }, "gift": { "text_highlight_color": "#32c3a6", "active": true, "text_animation": "wiggle", "alert_animation_out": "backOutDown", "layout": "banner", "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "alert_animation_in": "backInDown", "alert_duration": 10, "sound_volume": 50, "message_template": "", "font_size": 64, "font_weight": 800, "alert_min_amount": 0, "alert_text_delay": 0 }, "like": { "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/Explosion.gif", "sound_volume": 50, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "font_weight": 800, "alert_animation_out": "backOutDown", "alert_text_delay": 0, "text_highlight_color": "#32c3a6", "alert_animation_in": "backInDown", "text_animation": "wiggle", "layout": "banner", "alert_duration": 10, "font_size": 64, "message_template": "", "active": true }, "general": { "layout": "banner", "alert_parries": true, "parry_alert_delay": 3, "approved_manually": false, "censor_timeout": 0, "background_color": "#80ffac", "alert_delay": 3, "censor_recent_events": true }, "comment": {}, "follow": { "alert_duration": 10, "alert_animation_in": "backInDown", "message_template": "", "alert_animation_out": "backOutDown", "alert_text_delay": 0, "font_size": 64, "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "text_highlight_color": "#32c3a6", "text_color": "#ffffff", "layout": "banner", "sound_volume": 50, "text_animation": "wiggle", "font_weight": 800, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "active": true } }`));
  
  const socketConnect = (id) => {
    isLoading.current = true;
    
    changeLog(prevLog => [...prevLog, 'server connecting...']); 
    let socket = io("https://tiktoktools.glitch.me/obs",  {query: `id=${id}`});
    socket.on('connect', () => {  
      changeLog(prevLog => [...prevLog, ...['server connected', 'tiktok connecting...']]);
    });
    
    socket.on('ttConnectRetry', i => { 
      changeLog(prevLog => [...prevLog, `trying to connect (${i}/10)`]);
    });
    
    socket.on('ttRoomInfo', data => {
      isLoading.current = false;
      console.log(data);
      changeLog(prevLog => [...prevLog, 'tiktok connected']);
      setTimeout(() => {setLayer("setting")}, 3000)
    });
    
    socket.on('ttConnectFail', () => {
      isLoading.current = false;
      console.log('server connect fail');
      changeLog(prevLog => [...prevLog, 'tiktok connect fail']);
    });
    
    socket.on('gift', data => {
      if(options.gift.active){
        console.log(data)
        setEventQueue(oldList => [...oldList, {type:'gift', data: data}])
      }
    })
    
    socket.on('follow', data => {
      if(options.follow.active){
        console.log(data)
        setEventQueue(oldList => [...oldList, {type:'follow', data: data}])
      }
    })
    
    socket.on('like', data => {
      if(options.like.active){
        console.log(data)
        setEventQueue(oldList => [...oldList, {type:'like', data: data}])
      }
    })
    
    socket.on('share', data => {
      if(options.share.active){
        console.log(data)
        setEventQueue(oldList => [...oldList, {type:'share', data: data}])
      }
    })
  }
  
  useEffect(() => {
    if(isLoading.current){
      const interval = setInterval(() => {
        changeLog(prevState => {
          const newState = [...prevState]
          newState[newState.length - 1] += '.'
          return newState
        })
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading.current])
  
  const handleOptions = newOptions => {
    console.log(newOptions)
    setOptions({...options, ...newOptions})
    localStorage.alertboxOpts = JSON.stringify(newOptions)
  }
     
  const LogLayer = () => {
    return (
      log.map((text, i) => (<p key={i} className="mb-0">{text}</p>))
    )
  } 
  
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get('id');
    if(id){
      socketConnect(id)
    }
    else{
      changeLog(prevLog => [...prevLog, `URL invalid, please enter ULR like this: ${window.location.origin+window.location.pathname}?id={tiktok_id}`]);
    }
  }, []);
  
  useEffect(() => {
    if(eventQueue.length){
      let interval = setInterval(() => {
        let events = [...eventQueue];
        let event = events.shift();
        console.log(event.type);
        setEventQueue(events);
      }, 1000); 
      return () => clearInterval(interval);
    }
  }, [eventQueue])
 
  return (
    <div className="App">
      <div className="layer text-start" id="log" style={{"display": (layer === "log" ? "block" : "none")}}>
        <LogLayer />
      </div>
      <div className="layer" id="play" style={{"display":(layer === "play" ? "block" : "none")}}></div>
      <div className="layer" id="setting" style={{"display":(layer === "setting" ? "block" : "none")}}>
        <AlertboxOpts opts={options} onChangeOptions={handleOptions}/>
      </div>
    </div>
  );
}
export default Alertbox;
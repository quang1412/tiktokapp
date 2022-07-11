import React, {useEffect, useState, useRef} from 'react';
import AlertboxOpts from './AlertboxOpts';
import './style.css';
import './TextAnimations.css';
import './Animate.min.css';
import { io } from "socket.io-client";
 
const Alertbox = () => {
  
  const isLoading = useRef(false);
  const isOutro = useRef(false);
 
  const [options, setOptions] = useState(JSON.parse(localStorage.alertboxOpts || `{ "share": { "alert_duration": 10, "message_template": "", "alert_animation_out": "backOutDown", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_volume": 100, "alert_animation_in": "backInDown", "layout": "banner", "alert_text_delay": 0, "font_weight": 800, "text_color": "#ffffff", "text_highlight_color": "#32c3a6", "text_animation": "wiggle", "font_size": 64, "active": true, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg" }, "gift": { "text_highlight_color": "#32c3a6", "active": true, "text_animation": "wiggle", "alert_animation_out": "backOutDown", "layout": "banner", "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "alert_animation_in": "backInDown", "alert_duration": 10, "sound_volume": 50, "message_template": "", "font_size": 64, "font_weight": 800, "alert_min_amount": 0, "alert_text_delay": 0 }, "like": { "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/Explosion.gif", "sound_volume": 50, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "font_weight": 800, "alert_animation_out": "backOutDown", "alert_text_delay": 0, "text_highlight_color": "#32c3a6", "alert_animation_in": "backInDown", "text_animation": "wiggle", "layout": "banner", "alert_duration": 10, "font_size": 64, "message_template": "", "active": true }, "general": { "layout": "banner", "alert_parries": true, "parry_alert_delay": 3, "approved_manually": false, "censor_timeout": 0, "background_color": "#80ffac", "alert_delay": 3, "censor_recent_events": true }, "comment": {}, "follow": { "alert_duration": 10, "alert_animation_in": "backInDown", "message_template": "", "alert_animation_out": "backOutDown", "alert_text_delay": 0, "font_size": 64, "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "text_highlight_color": "#32c3a6", "text_color": "#ffffff", "layout": "banner", "sound_volume": 50, "text_animation": "wiggle", "font_weight": 800, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "active": true } }`));
  const [layer, setLayer] = useState("log");
  const [log, changeLog] = useState(["log:"]);
  const [eventQueue, setEventQueue] = useState([]);
  const [mainEvent, setMainEvent] = useState({"type": "like", "data" : {}});
  const [animate, setAnimate] = useState("");
  const [isDelay, setIsDelay] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  
  const audio = new Audio("https://isetup.vn/tiktok/assets/sound/new-message-4.ogg");

  const socketConnect = (id) => {
    return new Promise((resolve, reject) => { 
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
        return resolve(socket);
      });

      socket.on('ttConnectFail', () => {
        isLoading.current = false;
        changeLog(prevLog => [...prevLog, 'tiktok connect fail']);
        return reject(false)
      });
      
    })
  }
  
  const listenSocket = socket => {
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
  
  const playSound = (url = "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", vol = 50) => {
    try{
      audio.pause();
      audio.currentTime = 0;
      audio.src = url;
      audio.volume = vol/100;
      audio.play();
    } catch(err){}
  } 
  
  const delAllType = type => {
    let list = [...eventQueue]
    list = list.filter(e => {
      return e.type !== type;
    })
    setEventQueue(list);
  } 
  
  const handleAnimationEnd = e => {  
    setAnimate("");
    if(isOutro.current){
      setIsShowing(false);
    }
  }
  
  const MessTemplate = () => {
    var data;
    let template = options[mainEvent.type].message_template
    switch(mainEvent.type){
      case "gift":
        let amount = mainEvent.data.gift.repeat_count * mainEvent.data.extendedGiftInfo.diamond_count;
        data =  (template || '{username} send {giftcount} {giftname}')
          // .replace('{username}', `<span class="animated-letters">${mainEvent.data.uniqueId}</span>`)
          // .replace('{nickname}', `<span class="animated-letters">${mainEvent.data.nickname || mainEvent.data.uniqueId}</span>`)
          // .replace('{amount}', `<span  class="animated-letters">${amount}</span>`)
          // .replace('{giftcount}', `<span  class="animated-letters">${mainEvent.data.gift.repeat_count}</span>`)
          // .replace('{giftname}', `<span  class="animated-letters">${mainEvent.data.extendedGiftInfo.name}</span>`)
          // .replace('{giftimg}', `<span  class="${options[mainEvent.type].gift.text_animation}" style="display:inline-block"><img style="height:1.0em" src="${mainEvent.data.extendedGiftInfo.image.url_list[0]}"></span>`);
        break;
      case "like":
        data =  (template || '{username} send {likecount} heart!')
          // .replace('{username}', `<span class="animated-letters">${mainEvent.data.uniqueId}</span>`)
          // .replace('{nickname}', `<span class="animated-letters">${mainEvent.data.nickname || mainEvent.data.uniqueId}</span>`)
          // .replace('{likecount}', `<span class="animated-letters">${mainEvent.data.likeCount}</span>`);
        break;
      case "share":
        data = (template || '{username} just share livestream!')
        // .replace('{username}', `<span class="animated-letters">${mainEvent.data.uniqueId}</span>`)
        // .replace('{nickname}', `<span class="animated-letters">${mainEvent.data.nickname || mainEvent.data.uniqueId}</span>`);
        break;
      case "follow":
        data =  (template || '{username} is now follower');
        break;
      default:
        break;
      
    }  
    return (<div>{data}</div>)
    
    
      // options[mainEvent.type].message_template
  }
  
  useEffect(() => {
    let id = new URLSearchParams(window.location.search).get('id');
    if(id){
      socketConnect(id)
      .then(socket => {
        listenSocket(socket); 
        setTimeout(() => {setLayer("play")}, 3000);
      })
    }
    else{
      changeLog(prevLog => [...prevLog, `URL invalid, please enter ULR like this: ${window.location.origin+window.location.pathname}?id={tiktok_id}`]);
    }
  }, []);
  
  useEffect(() => {
    let events = [...eventQueue];
    let event = events.pop();
    if(!isDelay){
      var delay = options.general.alert_delay
      if(event){
        options.general.alert_parries && setIsShowing(false);
        if(!isShowing){
          setIsShowing(true);
          isOutro.current = false;
          setEventQueue(events);

          let opt = options[event.type];

          !opt.active && delAllType(event.type)

          delay += opt.alert_duration;

          options.general.alert_parries && (delay = options.general.parry_alert_delay)

          setMainEvent(event);
          document.body.setAttribute("data-layout", opt.layout)
          setAnimate(`animate__animated animate__${options.general.alert_parries ? "fadeIn" : opt.alert_animation_in}`);

          playSound();
           
          setTimeout(() => {
            if(document.getElementById(event.data.id)){
              setAnimate(`animate__animated animate__${options.general.alert_parries ? "fadeOut" : opt.alert_animation_out}`);
              isOutro.current = true;
            }
          }, opt.alert_duration*1000)
          
          setIsDelay(true);
          setTimeout(() => {
            setIsDelay(false)
          }, delay*1000)
        }
      } 
    }
  }, [eventQueue, isDelay, isShowing])
 
  return (
    <div className="App">
      <div className="layer text-start" id="log" style={{"display": (layer === "log" ? "block" : "none")}}>
        {log.map((text, i) => (<p key={i} className="mb-0">{text}</p>))}
      </div>
      <div className="layer" id="play" style={{"display":(layer === "play" ? "block" : "none")}}>
        <button onClick={e => {setLayer("setting")}} className="btn btn-sm btn-light position-absolute top-0 end-0 text-secondary border lh-1 p-2 m-2" style={{"zIndex":"1"}}><i className="fas fa-cog"></i></button>
        <div id="widget" className={animate} onAnimationEnd={handleAnimationEnd} style={{"display" : (isShowing ? "block" : "none")}}>
          <div id="alert-box">
            <div id="wrap">
              <div id="alert-image-wrap">
                <div id={mainEvent.data.id} className="d-none"></div>
                <div id="alert-image" className="" style={{"backgroundImage": `url(${options[mainEvent.type].image_url})`}}>
                  <img style={{"height": "1px","opacity": "0","width": "1px"}} src="https://cdn.streamlabs.com/library/giflibrary/jumpy-t-rex.gif"/>
                </div>
              </div>
              <div id="alert-text-wrap">
                <div id="alert-text" className=" ">
                  <div id="alert-message" style={{"fontSize": "64px","color": "rgb(255, 255, 255)","fontFamily": "&quot;Open Sans&quot","fontWeight": "800","textShadow": "0px 0px 1px #000, 0px 0px 2px #000, 0px 0px 3px #000, 0px 0px 4px #000, 0px 0px 5px #000"}}>
                    <MessTemplate />
                  </div>
                  <div id="alert-user-message" className="hidden" style={{"fontWeight": "400","fontSize": "24px","color": "rgb(255, 0, 0)","fontFamily": "Oranienbaum","textShadow":"0px 0px 1px #000, 0px 0px 2px #000, 0px 0px 3px #000, 0px 0px 4px #000, 0px 0px 5px #000"}}>Xin chào</div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
      <div className="layer" id="setting" style={{"display":(layer === "setting" ? "block" : "none")}}>
        <button onClick={e => {setLayer("play")}} className="btn btn-sm btn-light position-absolute top-0 end-0 text-secondary border lh-1 p-2 m-2" style={{"zIndex":"1"}}><i className="fas fa-times-circle"></i></button>
        <AlertboxOpts opts={options} onChangeOptions={handleOptions}/>
      </div>
    </div>
  );
}
export default Alertbox;
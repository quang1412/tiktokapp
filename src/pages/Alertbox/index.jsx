import React, {useEffect, useState, useRef} from 'react';
import AlertboxOpts from './AlertboxOpts';
import style from './style.module.css';
import './TextAnimations.css';
import'../../libs/css/Animate.min.css'; 
import { io } from "socket.io-client";
 
const Alertbox = () => {
  const userAgent = window.navigator.userAgent; 
  const isOBS = userAgent.includes('OBS');
   
  const isOutro = useRef(false);
  const isDelay = useRef(false);
  
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [isLoading, setIsLoading] = useState();
  const [options, setOptions] = useState(JSON.parse(localStorage.alertboxOpts || `{ "share": { "alert_duration": 10, "message_template": "", "alert_animation_out": "backOutDown", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_volume": 100, "alert_animation_in": "backInDown", "layout": "banner", "alert_text_delay": 0, "font_weight": 800, "text_color": "#ffffff", "text_highlight_color": "#32c3a6", "text_animation": "wiggle", "font_size": 64, "active": true, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg" }, "gift": { "text_highlight_color": "#32c3a6", "active": true, "text_animation": "wiggle", "alert_animation_out": "backOutDown", "layout": "banner", "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "alert_animation_in": "backInDown", "alert_duration": 10, "sound_volume": 50, "message_template": "", "font_size": 64, "font_weight": 800, "alert_min_amount": 0, "alert_text_delay": 0 }, "like": { "text_color": "#ffffff", "image_url": "https://isetup.vn/tiktok/assets/gif/Explosion.gif", "sound_volume": 50, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "font_weight": 800, "alert_animation_out": "backOutDown", "alert_text_delay": 0, "text_highlight_color": "#32c3a6", "alert_animation_in": "backInDown", "text_animation": "wiggle", "layout": "banner", "alert_duration": 10, "font_size": 64, "message_template": "", "active": true }, "general": { "layout": "banner", "alert_parries": true, "parry_alert_delay": 3, "approved_manually": false, "censor_timeout": 0, "background_color": "#80ffac", "alert_delay": 3, "censor_recent_events": true }, "comment": {}, "follow": { "alert_duration": 10, "alert_animation_in": "backInDown", "message_template": "", "alert_animation_out": "backOutDown", "alert_text_delay": 0, "font_size": 64, "image_url": "https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif", "text_highlight_color": "#32c3a6", "text_color": "#ffffff", "layout": "banner", "sound_volume": 50, "text_animation": "wiggle", "font_weight": 800, "sound_url": "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", "active": true } }`));
  const [layer, setLayer] = useState("log");
  const [tiktokId, setTiktokId] = useState("");
  const [log, changeLog] = useState(["log:"]);
  const [eventQueue, setEventQueue] = useState([]);
  const [mainEvent, setMainEvent] = useState({"type": "like", "data" : {}});
  const [animate, setAnimate] = useState("");
  // const [isDelay, setIsDelay] = useState(false);
  const [isShowing, setIsShowing] = useState(false);
  
  const audio = new Audio("https://isetup.vn/tiktok/assets/sound/new-message-4.ogg");
  audio.volume = 0;
  
  const socketConnect = (id) => {
    return new Promise((resolve, reject) => { 
      setIsLoading(true)
    
      changeLog(prevLog => [...prevLog, 'server connecting...']); 
      let socket = io("https://tiktoktools.glitch.me/obs",  {query: `id=${id}`});
      socket.on('connect', () => {  
        changeLog(prevLog => [...prevLog, ...['server connected', 'tiktok connecting...']]);
      });

      socket.on('ttConnectRetry', i => { 
        changeLog(prevLog => [...prevLog, `trying to connect (${i}/10)`]);
      });

      socket.on('ttRoomInfo', data => {
        setIsLoading(false);
        console.log(data);
        changeLog(prevLog => [...prevLog, 'tiktok connected']);
        return resolve(socket);
      });

      socket.on('ttConnectFail', () => {
        setIsLoading(false);
        changeLog(prevLog => [...prevLog, 'tiktok connect fail']);
        return reject(false)
      }); 
      
      socket.on('rejectTiktokId', () => {
        setIsLoading(false);
        changeLog(prevLog => [...prevLog, 'tiktok id was rejected, please contact to Admin']);
        return reject(false)
      })
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
  
  
  const handleOptions = newOptions => { 
    setOptions({...options, ...newOptions})
    localStorage.alertboxOpts = JSON.stringify(newOptions)
  }
  
  const playSound = (url = "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", vol = 50) => {
    if(canPlaySound){
      audio.pause();
      audio.currentTime = 0;
      audio.src = url;
      audio.volume = vol/100;
      audio.play();
    } 
  } 
  
  const EnableAudioBtn = () => {
    let enable = () => {
      audio.play()
      .then(_ => {
        setCanPlaySound(true);
      })
      .catch(error => {
        alert("Please open on PC to enable audio")
      });
    }
    return (
    <button 
      onClick={enable} 
      className={`btn btn-sm btn-white btn-rounded position-fixed bottom-0 end-0 m-2 ${(canPlaySound || layer !== 'play') && 'd-none'}`}>
      <span>Enable audio <i className="fas fa-volume-up"></i></span>
    </button>
    )
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
    if(!mainEvent.data.id){
      return true;
    }
    
    const letters = str => {
      try{
        str = str.toString();
        return (str.split("").map((i, k) => (
          <span
            style={{"color":"#32c3a6"}} key={k}
            className={["animated-letter", options[mainEvent.type].text_animation].join(' ')}>{i}
          </span>
        )))
      }
      catch{ return true }
    }
    
    let optsTemplate = options[mainEvent.type].message_template
    var template = mainEvent.type
    .replace("gift", (optsTemplate || '{username} send {giftcount} {giftname}'))
    .replace("like", (optsTemplate || '{username} send {likecount} heart!'))
    .replace("share", (optsTemplate || '{username} just share livestream!'))
    .replace("follow", (optsTemplate || '{username} is now follower'))
    
    return template.split(" ").map((text, i) => ( <span key={i}>{
      text === "{username}" ? letters(mainEvent.data.uniqueId) :
      text === "{nickname}" ? letters(mainEvent.data.nickname || mainEvent.data.uniqueId) :
      text === "{giftname}" ? letters(mainEvent.data.extendedGiftInfo.name) :
      text === "{giftcount}" ? letters(mainEvent.data.gift.repeat_count) :
      text === "{likecount}" ? letters(mainEvent.data.likeCount) :
      text === "{amount}" ? letters(mainEvent.data.gift.repeat_count * mainEvent.data.extendedGiftInfo.diamond_count) : text
    }{' '}</span>))
  }
  
  useEffect(() => {
    document.getElementsByTagName('html')[0].className = style.html;
     
    audio.play()
    .then(_ => {
      setCanPlaySound(true);
    })

    let id = new URLSearchParams(window.location.search).get('id'); 
    if(!id){
      setLayer("askId");
    }
    else{
      setTiktokId(id);
      socketConnect(id).then(socket => {
        listenSocket(socket); 
        setTimeout(() => {setLayer("play")}, 3000);
      });
    }
  }, []);
  
  useEffect(() => {
    if(isLoading){
      const interval = setInterval(() => {
        changeLog(prevState => {
          const newState = [...prevState]
          newState[newState.length - 1] += '.'
          return newState
        })
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading])
  
  useEffect(() => {
    let events = [...eventQueue];
    let event = events.pop();
    if(!isDelay.current){
      var delay = options.general.alert_delay
      if(event){
        options.general.alert_parries && setIsShowing(false);
        if(!isShowing){
          setIsShowing(true);
          isOutro.current = false;
          setMainEvent(event);
          setEventQueue(events);

          let opt = options[event.type];

          !opt.active && delAllType(event.type)

          delay += opt.alert_duration;

          options.general.alert_parries && (delay = options.general.parry_alert_delay)
          
          setAnimate(`animate__animated animate__${options.general.alert_parries ? "fadeIn" : opt.alert_animation_in}`);

          playSound(opt.sound_url, opt.sound_volume);
           
          setTimeout(() => {
            if(document.getElementById(event.data.id)){
              setAnimate(`animate__animated animate__${options.general.alert_parries ? "fadeOut" : opt.alert_animation_out}`);
              isOutro.current = true;
            }
          }, opt.alert_duration*1000)
          
          isDelay.current = true;
          setTimeout(() => {
            isDelay.current = false
          }, delay*1000)
        }
      } 
    }
  }, [eventQueue, isDelay.current, isShowing, canPlaySound])
 
  return (
    <div className="Alertbox">
      <div className={(layer==="log"?"p-3 text-start":"d-none")}>
        {log.map((text, i) => (<div key={i}><span className="bg-white">{text}</span></div>))}
      </div>
      <div className={layer==="askId"?"p-3":"d-none"}>
        <div className="card card-body mx-auto" style={{"maxWidth":"600px","minWidth":"300px"}}>
          <span>Please enter streaming tiktok id</span>
            <div className="input-group mx-auto" >
              <input onChange={e => {setTiktokId(e.target.value)}} type="text" className="form-control" placeholder="Enter Tiktok id" aria-label="Enter Tiktok id"/>
              <a href={"?id="+tiktokId}>
                <button className="btn btn-primary rounded-0 rounded-end h-100" type="button">
                  Connect
                </button>
              </a>
            </div>
        </div>
      </div>
      <div className={[style.alertboxLayer, style[options[mainEvent.type].layout], (layer !== "play" && "d-none")].join(' ')}>
        <button onClick={e => {setLayer("setting")}} className={style.hoverBtn+" btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3"} style={{"zIndex":"1"}}><i className="fas fa-cog"></i></button>
        <div className={[style.widget, animate].join(' ')} onAnimationEnd={handleAnimationEnd} style={{"display" : (isShowing ? "block" : "none")}}>
          <div className={style.alertBox}>
            <div className={style.wrap}>
              <div className={style.alertImageWrap}>
                <div id={mainEvent.data.id} className="d-none" ></div>
                <div className={style.alertImage} style={{"backgroundImage": `url(${options[mainEvent.type].image_url})`}}>
                  <img style={{"height": "1px","opacity": "0","width": "1px"}} src={options[mainEvent.type].image_url} alt="animate gif"/>
                </div>
              </div>
              <div className={style.alertTextWrap}>
                <div className={style.alertText}>
                  <div  className={style.alertMessage} style={{"fontSize": `${options[mainEvent.type].font_size}px`,"color": `${options[mainEvent.type].text_color || "rgb(255, 255, 255)"}`,"fontFamily": "Open Sans&quot","fontWeight": `${options[mainEvent.type].font_weight}`,"textShadow": "0px 0px 1px #000, 0px 0px 2px #000, 0px 0px 3px #000, 0px 0px 4px #000, 0px 0px 5px #000"}}>
                    <MessTemplate />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </div>
      <div className="layer position-relative m-auto" id="setting" style={{"display":(layer === "setting"?"block":"none"),"minWidth":"300px","maxWidth":"unset","height":"100vh"}}>
        <AlertboxOpts opts={options} onChangeOptions={handleOptions} setLayer={setLayer} isOBS={isOBS}/>
      </div>
      <EnableAudioBtn />
    </div>
  );
}
export default Alertbox;
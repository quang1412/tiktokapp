import { io } from 'socket.io-client';
import style from './livereactionbot.module.css';
import React, {useEffect, useState, useRef} from 'react';
 
const App = () => {
  
  const isLoading = useRef(false); 
  const canPlaySound = useRef(false);
  const isDelay = useRef(false);
  const [options, setOptions] = useState({
    geleral:{},
    gift:{active:true},
    like:{active:true},
    share:{active:true},
    follow:{active:true}
  });
  const [layer, setLayer] = useState("log");
  const [tiktokId, setTiktokId] = useState("");
  const [log, changeLog] = useState(["log:"]);
  const [eventQueue, setEventQueue] = useState([]);

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
  }, [isLoading.current]);
  
  const handleOptions = newOptions => { 
    setOptions({...options, ...newOptions})
    localStorage.alertboxOpts = JSON.stringify(newOptions)
  }
  
  const audio = new Audio("https://isetup.vn/tiktok/assets/sound/new-message-4.ogg");
  audio.volume = 0;
  
  const playSound = (url = "https://isetup.vn/tiktok/assets/sound/new-message-4.ogg", vol = 50) => {
    try{
      audio.pause();
      audio.currentTime = 0;
      audio.src = url;
      audio.volume = vol/100;
      audio.play();
    } catch(err){}
  } 
  
  const EnableAudioBtn = () => {
    let enable = () => {
      audio.play()
      .then(_ => {
        canPlaySound.current = true;
      })
      .catch(error => {
        alert("Please open on PC to enable audio")
      });
    }
    return (
      <button 
        onClick={enable} 
        className={`btn btn-sm btn-white btn-rounded position-fixed bottom-0 end-0 m-2 ${(canPlaySound.current || layer !== 'play') && 'd-none'}`}>
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
  
  useEffect(function(){
    document.getElementsByTagName('html')[0].className = style.html;
    
    let id = new URLSearchParams(window.location.search).get('id'); 
    if(!id){
      setLayer("askId");
      return;
    }
    setTiktokId(id);
    socketConnect(id)
    .then(socket => {
      listenSocket(socket); 
      setTimeout(() => {setLayer("play")}, 3000);
    }) 
  }, []);
  
  useEffect(() => {
    let events = [...eventQueue];
    let event = events.pop();
    if(!isDelay.current){
      isDelay.current = true;
      setEventQueue(events);
      console.log('run proccess');
      setTimeout(() => {isDelay.current = false}, 1000);
    }
  }, [eventQueue, isDelay.current])
 
  return (
    <div className="LiveReactionBot">
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
      <div className={layer==="play"?"":"d-none"}>
        <button onClick={e => {setLayer("setting")}} className={style.hoverBtn+" btn btn-lg btn-light position-absolute top-0 end-0 text-primary lh-1 p-2 m-3"} style={{"zIndex":"1"}}><i className="fas fa-cog"></i></button>
        <div>
          
        </div>
      </div>
      <div className={(layer==="setting"?"":"d-none")}>
      </div>
      <EnableAudioBtn />
    </div>
  );
}
export default App;
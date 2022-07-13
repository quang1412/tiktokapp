import { io } from 'socket.io-client';
import style from './livereactionbot.module.css';
import React, {useEffect, useState, useRef} from 'react'; 


const App = () => { 
  
  const canPlaySound = useRef(false); 
  
  const [options, setOptions] = useState({
    general:{delay:1000},
    gift:{active:true, template:'{nickname} / {username} / {giftname} / {giftcount} / {amount}'},
    like:{active:true, template:'{nickname} / {username} / {likecount}'},
    share:{active:true, template:'{nickname} / {username}'},
    follow:{active:true, template:'{nickname} / {username}'}
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [layer, setLayer] = useState("log");
  const [tiktokId, setTiktokId] = useState("");
  const [log, changeLog] = useState(["log:"]);
  const [eventQueue, setEventQueue] = useState([]);
  const [isDelay, setIsDelay] = useState(false)
  
  const socketConnect = (id) => {
    return new Promise((resolve, reject) => { 
      setIsLoading(true);
    
      changeLog(prevLog => [...prevLog, 'server connecting...']); 
      let socket = io("https://tiktoktools.glitch.me/obs",  {query: `id=${id}`});
      socket.on('connect', () => {  
        changeLog(prevLog => [...prevLog, ...['server connected', 'tiktok connecting...']]);
      });

      socket.on('ttConnectRetry', i => { 
        changeLog(prevLog => [...prevLog, `trying to connect (${i}/10)`]);
      });

      socket.on('ttRoomInfo', data => {
        setIsLoading(false)
        console.log(data);
        changeLog(prevLog => [...prevLog, 'tiktok connected']);
        return resolve(socket);
      });

      socket.on('ttConnectFail', () => {
        setIsLoading(false)
        changeLog(prevLog => [...prevLog, 'tiktok connect fail']);
        return reject(false)
      });
      
    })
  }
  
  function listenSocket(socket){
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
  }, [isLoading]);
  
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
      setTimeout(() => {setLayer("play")}, 1000);
    }) 
  }, []);
  
  useEffect(() => {
    let events = [...eventQueue];
    let event = events.pop();
    if(!isDelay){ 
      if(event){
        setIsDelay(true);
        setEventQueue(events);
        console.log('run proccess');

        let column = document.getElementById('eventsList');
        let newRow = document.createElement('li');
        newRow.className = "mb-2 "
        newRow.innerHTML = `<div class="d-flex align-items-center">
        <img class="${style.avatar}" src="${event.data.profilePictureUrl}">
          <div>
            <span>${event.type}</span>
            <span class="ms-2">${event.data.nickname || event.data.uniqueId}</span>
          </div>
        </div>`;
        column.insertBefore(newRow, column.firstChild);
        if(canPlaySound.current){
          fetch("https://tiktoktool.app/api/ggtts?text=hello")
          .then(res => res.text())
          .then(base64 => {
            console.log(base64)
            return new Promise((resolve, reject) => {
              let tts = new Audio(base64);
              tts.volume = 0.5;
              tts.addEventListener("ended", function() {
                resolve(true)
              });
              tts.addEventListener('error', () => {
                resolve(true)
              });
              tts.play();
            })
          })
          .catch(err => {console.log(err)})
          .finally(() => {
            setTimeout(() => {
              setIsDelay(false)
            }, options.general.delay);
          });
        }
        else{
          setTimeout(() => {
            setIsDelay(false)
          }, options.general.delay);
        }
      }
    }
  }, [eventQueue, isDelay, canPlaySound.current])
 
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
        <button onClick={e => {setLayer("setting")}} className={style.hoverBtn+" btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3"} style={{"zIndex":"1"}}>
          <i className="fas fa-cog"></i>
        </button>
        <div>
          <ul id="eventsList">
          </ul>
        </div>
      </div>
      <div className={(layer==="setting"?"":"d-none")}>
        <button onClick={e => {setLayer("play")}} className={style.hoverBtn+" btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3"} style={{"zIndex":"1"}}>
          <i className="fas fa-times-circle"></i>
        </button>
      </div>
      <EnableAudioBtn />
    </div>
  );
}
export default App;
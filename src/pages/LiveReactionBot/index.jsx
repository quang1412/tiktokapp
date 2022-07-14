import { io } from 'socket.io-client';
import style from './livereactionbot.module.css';
import React, {useEffect, useState, useRef} from 'react'; 


const App = () => {
  const [options, setOptions] = useState({
    general:{
      delay:3000, 
      pageTitle:"Tiktok tool"
    },
    gift:{
      active:true, 
      voiceTemp:'cảm ơn {nickname} đã tặng quà',
      // voiceTemp:'{nickname} / {username} / {giftname} / {giftcount} / {amount}',
    },
    like:{
      active:true, 
      voiceTemp:'cảm ơn {nickname} đã thả tim',
      // voiceTemp:'{nickname} / {username} / {likecount}',
    },
    share:{
      active:true, 
      voiceTemp:'cảm ơn {nickname} đã chia sẻ livestream',
      // voiceTemp:'{nickname} / {username}',
    },
    follow:{
      active:true, 
      voiceTemp:'cảm ơn {nickname} đã follow kênh',
      // voiceTemp:'{nickname} / {username}',
    }
  });
  
  const [canPlaySound, setCanPlaySound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [layer, setLayer] = useState("log");
  const [tiktokId, setTiktokId] = useState("");
  const [log, changeLog] = useState(["log:"]);
  const [eventQueue, setEventQueue] = useState([]);
  const [isDelay, setIsDelay] = useState(false);
  const [lastEvent, setLastEvent] = useState({type:'gift',data:{uniqueId:"abc123",nickname:"ABC123",profilePictureUrl:"https://static.fullstack.edu.vn/static/media/fallback-avatar.155cdb2376c5d99ea151.jpg"}})
  const [likeCount, updateLikeCount] = useState({});
  const [shareCount, updateShareCount] = useState({});
  const [donateCount, updateDonateCount] = useState({});
  
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
  
  function listenSocket(socket){
    socket.on('gift', data => {
      if(options.gift.active){
        console.log(data)
        let amount = data.gift.repeat_count * data.extendedGiftInfo.diamond_count;
        updateDonateCount(function(c){c[data.uniqueId] = (c[data.uniqueId]||0) + amount; return c})
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
        updateLikeCount(function(c){c[data.uniqueId] = (c[data.uniqueId]||0) + data.likeCount; return c})
        setEventQueue(oldList => [...oldList, {type:'like', data: data}]);
      }
    })
    
    socket.on('share', data => {
      if(options.share.active){
        console.log(data)
        updateShareCount(function(c){c[data.uniqueId] = (c[data.uniqueId]||0) + 1; return c})
        setEventQueue(oldList => [...oldList, {type:'share', data: data}])
      }
    })
  }
  
  function replaceTempVoice(event){
    let isGift = (event.type === "gift");
    let isLike = (event.type === "like");
    return options[event.type].voiceTemp.split(" ").map(text => {
      return (text === '{nickname}'    ? event.data.nickname : 
              text === '{username}'    ? event.data.uniqueId : 
              (text === '{giftname}'   * isGift)  ? event.data.extendedGiftInfo.name : 
              (text === '{giftcount}'  * isGift)  ? event.data.gift.repeat_count : 
              (text === '{amount}'     * isGift)  ? (event.data.gift.repeat_count * event.data.extendedGiftInfo.diamond_count) : 
              (text === '{likecount}'  * isLike)  ? event.data.likeCount : text)
    }).join(" ")
  }
  
//   function getUserFollowerCount(){
//     return new Promise((resolve, reject) => {
      
//     })
//   }
  
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
        setLastEvent(event);
        setIsDelay(true);
        setEventQueue(events);
        console.log('run proccess');
        
        let name = event.data.nickname || event.data.uniqueId;
        
        let column = document.getElementById('eventsList');
        let newRow = document.createElement('li');
        newRow.className = style.listItem+" overflow-hidden";
        newRow.innerHTML = `<div class="d-flex align-items-center">
          <img class="${style.avatar}" src="${event.data.profilePictureUrl}"/>
          <div class="d-flex flex-column ms-2">
            <span class="${style.userName}">${name}</span>
            <span class="${style.subText}">
              <span><i class="fa-solid fa-heart text-danger"></i> ${likeCount[event.data.uniqueId]||0}</span>
              <span class="ms-2"><i class="fa-solid fa-share text-primary"></i> ${shareCount[event.data.uniqueId]||0}</span>
              <span class="ms-2"><i class="fa-solid fa-gem text-warning"></i> ${donateCount[event.data.uniqueId]||0}</span>
            </span>
          </div>
        </div>`;
        // <span class="${style.subText}">${options[event.type].subtitleTemp}</span>
        // <span class="${style.subText}">${event.data.uniqueId}</span>
        console.log(likeCount );
        column.insertBefore(newRow, column.firstChild);
        
        var delay = options.general.delay;
        if(canPlaySound){
          fetch("https://tiktoktool.app/api/ggtts?text="+replaceTempVoice(event))
          .then(res => res.text())
          .then(base64 => {

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
            }, delay);
          });
        }
        else{
          setTimeout(() => {
            setIsDelay(false)
          }, delay);
        }
      }
    }
  }, [eventQueue, isDelay, canPlaySound, likeCount, shareCount])
 
  const handleOptionsChange = async e => {
    let target = e.target;
    let type = target.type;
    let optType = target.closest("form").name;
    let optName = target.name;
    var value = target.value;
    
    switch(type){
      case 'number':
        value = parseInt(value.replace('e', '') || options[optType][optName]);
        target.value = value;
        break;
      case 'range':
        value = parseInt(value);
        break;
      case 'radio':
        (value === "true" || value === "false") && (value = (value === 'true'));
        break;
      default:
        break;
    }
    
    switch(optName){
      case "text_color":
        if(!(/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value))){
          value = "#ffffff";
        } 
        break;
      case "text_highlight_color":
        if(!(/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(value))){
          value = "#ffffff";
        } 
        break;
      default:
        break;
    }
    
    options[optType][optName] = value;
    setOptions(options);
  }
  
  function SettingLayer(){
    return (<div className="card w-100 h-100">
    <div className="card-header">
      <ul className="nav nav-tabs" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link fs-6 py-2 px-3 active" data-mdb-toggle="tab" href="#tab-general" role="tab" aria-controls="tab-general" aria-selected="true">General</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fs-6 py-2 px-3" data-mdb-toggle="tab" href="#tab-gift" role="tab" aria-controls="tab-gift" aria-selected="false">Donate</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fs-6 py-2 px-3" data-mdb-toggle="tab" href="#tab-follow" role="tab" aria-controls="tab-follow" aria-selected="false">Follow</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fs-6 py-2 px-3" data-mdb-toggle="tab" href="#tab-like" role="tab" aria-controls="tab-like" aria-selected="false">Like</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link fs-6 py-2 px-3" data-mdb-toggle="tab" href="#tab-share" role="tab" aria-controls="tab-share" aria-selected="false">Share</button>
        </li>
        <li className="ms-auto" role="presentation">
          <button onClick={e => {setLayer("play")}} className="btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3" style={{"zIndex":"1"}}><i className="fas fa-times-circle"></i></button>
        </li>
      </ul>
    </div>
    <div className="card-body text-start overflow-auto">
      <div className="tab-content pt-3" id="pills-tabContent">
        <div className="tab-pane fade show active" id="tab-general" role="tabpanel" aria-labelledby="general">
          <form name="general">
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label mb-0">Alert delay</label>
              </div>
              <div className="col-8">
                <div className="range">
                    <input name="alert_delay" defaultValue={options.general.alert_delay} onChange={handleOptionsChange} type="range" className="form-range" min="0" max="30" step="1" />
                </div>
                </div>
            </div>
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label mb-0">Parry alert</label>
              </div>
              <div className="col-8">
                <div className="form-check d-inline-block">
                  <input name="alert_parries" defaultValue="true" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={options.general.alert_parries}/>
                  <label className="form-check-label">
                    On
                  </label>
                </div>
                <div className="form-check d-inline-block ms-3">
                  <input name="alert_parries" defaultValue="false" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={!options.general.alert_parries}/>
                  <label className="form-check-label">
                    Off
                  </label>
                </div>
              </div>
            </div>
            <div className="row mb-3 parry_alert_delay" style={{"display": (options.general.alert_parries ? "flex" : "none")}}>
              <div className="col-4">
                <label className="form-label mb-0">Parry delay</label>
              </div>
              <div className="col-8">
                <div className="range">
                  <input name="parry_alert_delay" defaultValue={options.general.parry_alert_delay} onChange={handleOptionsChange} type="range" className="form-range" min="1" max="20" step="1" data-before="1" data-before-subfix="s"/>
                </div>
                </div>
            </div>
          </form>
        </div>
        {Object.keys(options).map(function(type, i){
          if(type !== "general"){ return (
            <div key={type} className="tab-pane fade" id={`tab-${type}`} role="tabpanel">
              <form name={type}>
                
              </form>
            </div>
          ) }
        })}
        </div>
      </div>
    </div>
    )
  }
  
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
      <div className={layer==="play"?style.layerPlay:"d-none"}>
        <button onClick={e => {setLayer("setting")}} className={style.hoverBtn+" btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3"} style={{"zIndex":"1"}}>
          <i className="fas fa-cog"></i>
        </button>
        <div className="p-3">
          <p className={"text-primary "+style.pageTitle}>
            {options.general.pageTitle}
          </p>
          <div className={"text-center text-md-start "+style.lastEvent} style={{"backgroundColor":"white"}}>
            <img className="" src={lastEvent.data.profilePictureUrl}/>
            <div className="my-1">
              <p className={style.userName}>{lastEvent.data.nickname}</p>
              <p className={style.subText}>{replaceTempVoice(lastEvent)}</p>
            </div>
          </div>
          <ul id="eventsList" className={style.list}>
          </ul>
        </div>
      </div>
      <div className={(layer==="setting"?"":"d-none")}>
        <button onClick={e => {setLayer("play")}} className={style.hoverBtn+" btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3"} style={{"zIndex":"1"}}>
          <i className="fas fa-times-circle"></i>
        </button>
        <SettingLayer />
      </div>
      <EnableAudioBtn />
    </div>
  );
}
export default App;
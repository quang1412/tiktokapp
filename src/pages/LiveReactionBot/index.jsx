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
        if(canPlaySound){
          let tts = new Audio("data:audio/mp3;base64,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sXWB7+6Rh5roQzeEvMsESQygEpfquIrR//NExG8WGwakAMzKuaPwm6yeoqZEZVDUNGNqnDS3MI00P/x3Qc//u///r6eT7+KuqDQFLnNd1rdJ69THOVzipB3///9dguqGlGIXWkuBQgHxMCBJi/e5OycgQ1yArsOC//NExGkXMaKcAN5KlETDujj0WYoCZBEVvShYEknYvKJW8QjMBZGVq92GP/94zn/v8P//t7+n/MZmQxgM0jk6esm5gTEAgjn0df///rYihgW5w4sSGTpkqhWe5rbYDbpW//NExF8V0Z6gANZElNpyzEQvNIts/Q1xnAOzzePRYBsdAldxsDIidwMxR6WpxcxONzVuk3t5ft7eqHRQqERr2bfzms4YwOANyVPq////6BEi+sYOlTofGjG/jleeg0xp//NExFoUsY6gANTElP6M9ggwg0rkN5bqrwIBjJjdREErAvhTEuGEEHCIBVGaSJiTW5z1r/+///azy66L67PWixSXZ/////////pp/amq2y89zqzRcJWvYxuSo3ZHLVZ9//NExFoT0wqkANNEuZaYakfyVwwZAApHeXSaTBBUgpAyWGgMiHOPFtlmRXX3+///+n0eV0b2ff66OpXDlBu7////yUVOoLPSmLMVUUNqy/8KYI4L+jeOwoSOoDeSNzh8//NExF0SmZqkANTElAsADeifTPjpBSgNIUuOEeBE0qlLLD9be3/p/6fZ9Ag/k/1s9jBWDnRzf////XKLQ+u9qT0Oh81V5/226H2wmY80txEMwUVcac2RwCfC2KNyuOYB//NExGUSSZqkANUElJHh5ymLYVInNqBiTL9E09//t/6/Tme3J7v5XyFHEHPjf////0RQX8ItAT6l1Fe9TsOJZT5fOvTBQwckgpKBLYlYChFwig9CtwDRA54Boh2kBE3j//NExG4RoaKgAMzElCIrYn60lJf/////+n0t9/p2IMSdkv////p1mGs7xMqGtyihBiAdmYEQ1EI29Jy4wKZTtM4akV00SslDdGMFaqy5i2gNplIhiiZghke1Q56f/9SV//NExHoRWZqYANSElFP5YWB079P///9Df/cViTovE5hrdR8WRc1YxbULFBRV+yuGG5q9eaHGmtadF0BMn9WAcQwjHcIcB/EnrbMl3LO1etzvy0r6ZYKuJBVbiqez//////NExIcQgIaEAN6eSP8dTcWBbFAKEplKewoEhMWCIZrEd+GIDbsz1jA9iflgW2hVIlsn393msEgMJHvMrLxpyqrWy4YJlUVhTtX+2l2vt/////QqPES9cHSlfNjKxAE1//NExJgRuKJsANYeTH7RjsfgUNTEJEtPGHQUXSEiSmdmMPByG+67MsELz7oQUAzaHrY/ubrUMc+f0SyupJtn/9D9/0U6ibsoKlzNPvDOdh4aRiy0e9qB1nEsRwkrTQ2F//NExKQRCIYYAMYeSBzDp8kWNYNQa3iVSFovUJj1oUqttYiwXUwW2sJR/pEr++edKu0/ZSouGEQWiqJwJ6Uxt3BolidLMD8IvQHdEyigAJIBhBJ7GIdtAcMFQJEgcaUC//NExLIQqPIAAMGEcM4VNQIx4hC0Inlo2PSNyFI2KJjWU4ypO11W3fbq+/RVCh0SC8TR29f6RQzSBJRIsJBk0cAQgoKQYcBBFGowYHSpENB0JDAqAkFSJIOhIYBQEVIM//NExMIQ2Hn0AMJMSCR5ygLKskj1T6GWvq0Mtq/1f6kjwjhPQjZUCwF3LGpALSJMXJzgYTDB0nUEV3gGCEBxaJXKvBFFiDOliKdJ/cIE4hrCciWR7IlkaeQsjkkLMpIg//NExNESiLHoAMJGTPIpJyxFIj3/M5JL//liJ7v/DPNJnzzJxA+X/aIkUjI7YVVFVpJEAEeWBoeOovB/HclLtzE/PtMQhaO50SQb2HsXiGTjUrpmRLadPIXv8mQm5guU//NExNkRcIXIAMGGSC9o8XvnlFiy/0bsw2xzmSsRRlDIFBdSI+j1GNl2BwIsDnKgLVaPkEEAzrUpXTTJ3DuyxXYg5pqBiiKTJ3NMyo7ggAt3lAC4dI33frsRKUcPABU7//NExOYXuK3IAHpGTUS5S41Sp8IXMiXM1K/H21h67WnIVEBQPkIMCsEhYRmB16KhS1hxpzdahOiUifrKakUZIqnsVVLiRRZUnN2QchCDAQGIgcs0geQnhgTjOYQHSdwm//NExNohgxHkAMMGuS6IYQDoYE4NA2W4KxnNs2VjKXzI3EEstGUMyOy2WRN02N0MQHSwjUcjQLFLaBwXUlUM4rzRcU8zqFivvVtnCTs1kRSwkpfq5hJ1jQ1z//pNSan0//NExKchCwXsAMJGuZjVGgqsFUSJKix6iSokuKJKBRsUQbChRYU0ksz///mOf8pv7u/mpfyym/0Mv8x/jf+cSbVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExHUVYQnYAHmGcVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV");
          tts.volume = 0.5;
          tts.addEventListener("ended", function() {
            setTimeout(() => {
              setIsDelay(false)
            }, options.general.delay);
          });
          tts.addEventListener('error', () => {
            console.log('tts error')
            setIsDelay(false)
          });
          tts.play();
        }
      }
    }
  }, [eventQueue, isDelay])
 
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
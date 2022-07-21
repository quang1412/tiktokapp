import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketConnect = (props) => {
    const onConnected = props.onConnected;

    const [tiktokId, setTiktokId] = useState(""); 
    const [log, setLog] = useState([]); 

    const socketConnect = (id) => {
        return new Promise((resolve, reject) => {
            // setIsLoading(true);

            setLog(prevLog => [...prevLog, 'server connecting...']);
            let socket = io("https://bow-lush-day.glitch.me/obs", { query: `id=${id}` }); 
            socket.on('connect', () => {
                setLog(prevLog => [...prevLog, ...['server connected', 'tiktok connecting...']]);
            });

            socket.on('ttConnectRetry', i => {
                setLog(prevLog => [...prevLog, `trying to connect (${i}/10)`]);
            });

            socket.on('ttRoomInfo', data => {
                // setIsLoading(false)
                console.log(data);
                setLog(prevLog => [...prevLog, 'tiktok connected']);
                return resolve(socket);
            });

            socket.on('ttConnectFail', () => {
                // setIsLoading(false)
                setLog(prevLog => [...prevLog, 'tiktok connect fail']);
                return reject(false)
            });

            socket.on('rejectTiktokId', () => {
                // setIsLoading(false)
                setLog(prevLog => [...prevLog, 'tiktok id was rejected, please contact to Admin']);
                return reject(false)
            })
        })
    }

    useEffect(() => {
        setTiktokId(new URLSearchParams(window.location.search).get('id'));
        if(tiktokId){
            socketConnect(tiktokId)
            .then(socket => {
                onConnected(socket);
            })
            .catch( )
        }
    }, [tiktokId, onConnected]) 

    return (
        !tiktokId ?
        (<div className="card card-body mx-auto" style={{ "maxWidth": "600px", "minWidth": "300px" }}>
            <form>
                <span>Please enter streaming tiktok id</span>
                <div className="input-group mx-auto" >
                    <input name="id" type="text" className="form-control" placeholder="Enter Tiktok id" aria-label="Enter Tiktok id" />
                    <button type="submit" className="btn btn-primary rounded-0 rounded-end h-100">Connect</button>
                </div>
            </form>
        </div>)
        :
        (<div className="log">
            {log.map((text, i) => (<div key={i}><span className="bg-white">{text}</span></div>))}
        </div>)
    )

}

export default SocketConnect;
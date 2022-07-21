import React, { useEffect, useState } from 'react';
import SocketConnect from "../../components/SocketConnect";
import style from "./style.module.css";
import "../../libs/css/Animate.min.css";
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';  

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopLike = () => {
    const [options, setOptions] = useState(JSON.parse(window.localStorage.topLikeOptions || `{ "bg_img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRa9SIqXFcDX9fOWqAMs0gImCOdW3r9YctCzRvifNCvWu4D9z1Z40YHm_P26IrCOREr5Cs&usqp=CAU&usqp=CAU", "bg_opacity": 70, "bar_color": "#3e95cd" }`));
    const [layer, setLayer] = useState("connect");
    const [viewerData, setViewerData] = useState({});
    const [likeData, setlikeData] = useState({});
    const [recentLike, setRecentLike] = useState([]);
    const [topLike, setTopLike] = useState([]);

    function socketListen(s) {
        setLayer("game");
        s.on('like', event => {
            console.log(event); 
            let { nickname, profilePictureUrl, uniqueId, userId, followRole } = event;
            !viewerData[event.uniqueId] && setViewerData(current => ({ ...current, [event.uniqueId]: { nickname, profilePictureUrl, uniqueId, userId, followRole } }))
            setlikeData(current => ({ ...current, [event.uniqueId]: ((current[event.uniqueId] || 0) + event.likeCount) }));

            setRecentLike(current => ([...current.slice(-9), event]))
        }); 
    }

    async function imageCheck(url) {
        return new Promise(resolve => {
            let img = new Image()
            img.src = url
            img.addEventListener('load', () => {
                resolve(true);
            });
            img.addEventListener('error', () => {
                resolve(false);
            });
        })
    }

    function handleOptionChange(e){
        let type = e.target.closest('form').name;
        let name = e.target.name;
        var value = e.target.value;
        switch(e.target.type){
            default:
                break;
            case "range":
                value = parseInt(value);
                break;
        }
        console.log(type, name, value);
        let newOpts = {...options};
        newOpts[type][name] = value;
        setOptions(newOpts);
    }

    async function changeBackground(){
        let link = prompt("Nhập link ảnh, hoặc để trống để xoá bỏ", options.bg_img);
        let text;
        if (link == "") {
            setOptions(current => ({...current, bg_img:""}))
        } else {
          text = "Hello " + link + "! How are you today?";
          let check = await imageCheck(link);
          check && (setOptions(current => ({...current, bg_img:link})))
        }
    }

    function resetChart(){
        setlikeData({})
    }

    useEffect(() => {
        let top = Object.keys(likeData).sort(function (a, b) { return likeData[b] - likeData[a] });
        setTopLike(top.slice(0, 10))
    }, [likeData]);

    useEffect(() => {
        window.localStorage.topLikeOptions = JSON.stringify(options);
    },[options])

    return (
        <div className={style.App}>
            {layer === "connect" && <SocketConnect onConnected={socketListen} />}
            <div className={layer === "game" ? style.gameScreen : 'd-none'} style={{}}>
                <div className={style.main}>
                    <h4 className={style.title}>Top thả tim</h4>
                    <div className={style.chartContainer} style={{ backgroundImage: `url("${options.bg_img}")` }}> 
                        <div className={style.topBar}>
                            {topLike.map((uniqueId, index) => {
                                return (
                                    <div key={index} className={style.topUser}>
                                        <img className={style.avatar} src={viewerData[uniqueId].profilePictureUrl} alt="avatar"/>
                                        {/* <span className={style.name}>{(viewerData[uniqueId].nickname || uniqueId).substring(0, 15)}</span> */}
                                    </div>
                                )
                            })}
                        </div>
                        <div className={style.chart} style={{ backgroundColor: `rgb(0, 0, 0, ${options.bg_opacity / 100})` }}>
                            <Bar 
                                plugins={[ChartDataLabels]} 
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    indexAxis: "y",
                                    layout: {
                                        padding: {
                                            top: 15,
                                            right: 15,
                                            bottom: 15,
                                            left: 40,
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        },
                                        datalabels: {
                                            display: true,
                                            font: {
                                                size: 14,
                                                weight: 500
                                            },
                                            padding: {
                                                left: 10,
                                                right: 10
                                            },
                                            color: '#fff',
                                            align: 'right',
                                            anchor: 'start',
                                        },
                                        tooltip: {
                                            displayColors: false
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: "Predicted world population (millions) in 2050"
                                    },
                                    scales: {
                                        x: {
                                            display: false
                                        },
                                        y: {
                                            grid: {
                                                display: false
                                            },
                                            ticks: {
                                                font: {
                                                    size: 14,
                                                    weight: 500
                                                },
                                                color: "#fff"
                                            }
                                        }
                                    }
                                }} 
                                data={{
                                    labels: topLike[0] ? topLike.map(uniqueId => {
                                        return (viewerData[uniqueId].nickname || uniqueId).substring(0, 15)
                                    }) : ['top 1', 'top 2', 'top 3', 'top 4', 'top 5'],
                                    datasets: [{
                                        label: "Lượt like",
                                        backgroundColor: options.bar_color,
                                        borderRadius: 5,
                                        borderSkipped: false,
                                        data: topLike[0] ? topLike.map(uniqueId => {
                                            return likeData[uniqueId]
                                        }) : [0, 0, 0, 0, 0]
                                    }]
                                }}
                            />
                        </div>
                        <div className={style.recentEvent}>
                            {recentLike.map((event, index) => {
                                return <p key={index} className="mb-0 text-nowrap">{`${event.nickname || event.uniqueId} +${event.likeCount} ♥︎`}</p>
                            })}
                        </div>
                    </div>
                    <div className={style.toolBar}>
                        <small onClick={changeBackground} role="button">
                            Đổi ảnh <i className="fas fa-image"></i>
                        </small>
                        <small onClick={resetChart} className="ms-2 text-danger" role="button">
                            Reset <i className="fas fa-sync"></i>
                        </small>
                    </div>
                </div> 
            </div> 
        </div>
    )
}

export default TopLike;
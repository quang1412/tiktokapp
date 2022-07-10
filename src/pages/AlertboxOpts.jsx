import React, {useEffect, useState} from "react";

export default function AlertboxOpts(props){
  const options = props.opts;
  const intro = ["fade In","fade In Down","fade In Down Big","fade In Left","fade In Left Big","fade In Right","fade In Right Big","fade In Up","fade In Up Big","fade In Top Left","fade In Top Right","fade In Bottom Left","fade In Bottom Right","back In Down","back In Left","back In Right","back In Up","bounce In","bounce In Down","bounce In Left","bounce In Right","bounce In Up","flip In X","flip In Y","light Speed In Right","light Speed In Left","rotate In","rotate In Down Left","rotate In Down Right","rotate In Up Left","rotate In Up Right","roll In","zoom In","zoom In Down","zoom In Left","zoom In Right","zoom In Up","slide In Down","slide In Left","slide In Right","slide In Up"];
  const outro = ["fade Out","fade Out Down","fade Out Down Big","fade Out Left","fade Out Left Big","fade Out Right","fade Out Right Big","fade Out Up","fade Out Up Big","fade Out Top Left","fade Out Top Right","fade Out Bottom Right","fade Out Bottom Left","back Out Down","back Out Left","back Out Right","back Out Up","bounce Out","bounce Out Down","bounce Out Left","bounce Out Right","bounce Out Up","flip Out X","flip Out Y","light Speed Out Right","light Speed Out Left","rotate Out","rotate Out Down Left","rotate Out Down Right","rotate Out Up Left","rotate Out Up Right","roll Out","zoom Out","zoom Out Down","zoom Out Left","zoom Out Right","zoom Out Up","slide Out Down","slide Out Left","slide Out Right","slide Out Up"];
  
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
        (value === "true" || value === "false") && (value = (value == 'true'));
        break;
    }
    
    switch(optName){
      case "image_url":
        let check = await checkImage(value);
        if(!check){
          target.value = options[optType][optName];
          return;
        }
        break;
        
    }
    
    console.log(optType, optName, value);
    options[optType][optName] = value;
    props.onChangeOptions(options);
  } 
  
  const checkImage = async url => {
    return new Promise((resolve) => {
      console.log(url)
      var image = new Image();
      image.addEventListener('load', () => resolve(true));
      image.addEventListener('error', () => resolve(false));
      image.src = url;
    })
  }
  
  const checkAudio = async url => {
    return new Promise((resolve) => {
      console.log(url)
      var audio = new Audio();
      audio.addEventListener('load', () => resolve(true));
      audio.addEventListener('error', () => resolve(false));
      audio.src = url;
    })
  }
  
  return (
    <div className="card">
    <div className="card-header">
      <ul className="nav nav-tabs" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" data-mdb-toggle="tab" href="#tab-general" role="tab" aria-controls="tab-general" aria-selected="true">General</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" data-mdb-toggle="tab" href="#tab-gift" role="tab" aria-controls="tab-gift" aria-selected="false">Donate</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" data-mdb-toggle="tab" href="#tab-follow" role="tab" aria-controls="tab-follow" aria-selected="false">Follow</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" data-mdb-toggle="tab" href="#tab-like" role="tab" aria-controls="tab-like" aria-selected="false">Like</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" data-mdb-toggle="tab" href="#tab-share" role="tab" aria-controls="tab-share" aria-selected="false">Share</button>
        </li>
        <li className="ms-auto d-flex align-items-center">
          <button id="close-setting" className="btn btn-sm btn-light text-secondary border lh-1 p-2"><i className="fas fa-times-circle"></i></button>
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
        {Object.keys(options).map((type, i) => {
          if(type === 'general' || type === "comment") return;
          let opt = options[type];
          return (
            <div key={type} className="tab-pane fade" id={`tab-${type}`} role="tabpanel">
              <form name={type} >
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Active</label>
                  </div>
                  <div className="col-8">
                    <div className="form-check d-inline-block">
                      <input name="active" defaultValue="true" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={options[type].active}/>
                      <label className="form-check-label">
                        On
                      </label>
                    </div>
                    <div className="form-check d-inline-block ms-3">
                      <input name="active" defaultValue="false" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={!options[type].active}/>
                      <label className="form-check-label">
                        Off
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Layout</label>
                  </div>
                  <div className="col-8">
                    <div className="form-check d-inline-block">
                      <input name="layout" defaultValue="above" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={options[type].layout === "above"}/>
                      <label className="form-check-label">
                        Above
                      </label>
                    </div>
                    <div className="form-check d-inline-block ms-3">
                      <input name="layout" defaultValue="banner" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={options[type].layout === "banner"}/>
                      <label className="form-check-label">
                        Banner
                      </label>
                    </div>
                    <div className="form-check d-inline-block ms-3">
                      <input name="layout" defaultValue="side" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={options[type].layout === "side"}/>
                      <label className="form-check-label">
                        Side
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Effects</label>
                  </div>
                  <div className="col-8 d-flex">
                    <select name="alert_animation_in" defaultValue={options[type].alert_animation_in} className="form-select me-1">{
                      intro.map((e, i) => {
                        return (<option key={`alert_animation_in${i}`} value={e.replaceAll(' ','')}>{e}</option>)
                      }) 
                    }</select>
                    <select name="alert_animation_out" defaultValue={options[type].alert_animation_out} className="form-select ms-1">{
                      outro.map((e, i) => {
                        return (<option key={`alert_animation_out${i}`} value={e.replaceAll(" ","")}>{e}</option>)
                      }) 
                    }</select> 
                  </div>
                </div>
                { type === "gift" && (
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Min. donate</label>
                    </div>
                    <div className="col-8">
                      <div className="input-group w-50">
                        <input name="alert_min_amount" defaultValue={options[type].alert_min_amount} onChange={handleOptionsChange} type="number" className="form-control" placeholder="1"/>
                      </div>
                    </div>
                  </div>) } 
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Template</label>
                  </div>
                  <div className="col-8"> 
                    <div className="input-group">
                      <input name="message_template" defaultValue={options[type].message_template} onChange={handleOptionsChange} type="text" className="form-control" 
                        placeholder=
                        {(type === "gift" ? "{username} send {giftcount} {giftname}" : 
                          type === "follow" ? "{username} followed host" : 
                          type === "like" ? "{username} send {likecount} like" : 
                          type === "share" ? "{username} shared host" : ""
                        )}/>
                    </div>
                    <small>Keys:
                      {(type === "gift"   ? "{nickname} / {username} / {giftname} / {giftcount} / {amount}}" : 
                        type === "follow" ? "{nickname} / {username} / {giftname} / {giftcount} / {amount}" : 
                        type === "like"   ? "{nickname} / {username} / {likecount}" : 
                        type === "share"  ? "{nickname} / {username}" : ""
                      )} 
                    </small>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Text effect</label>
                  </div>
                  <div className="col-8 d-flex align-items-center">
                    <select name="text_animation"  defaultValue={options[type].text_animation} className="form-select me-2">
                      <option defaultValue='wiggle'>Wiggle</option>
                      <option defaultValue="wave">Wave</option>
                      <option defaultValue="wobble">Wobble</option>
                      <option defaultValue="rubberBand">Rubberband</option>
                      <option defaultValue="bounce">Bounce</option>
                      <option defaultValue="tada">Tada</option>
                    </select>
                    <div className="fw-bold text-nowrap text-primary">
                      <span className={`animated-letter ${options[type].text_animation}`}>S</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>A</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>M</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>P</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>L</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>E</span>
                      <span className="p-1"></span>
                      <span className={`animated-letter ${options[type].text_animation}`}>T</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>E</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>X</span>
                      <span className={`animated-letter ${options[type].text_animation}`}>T</span>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Image</label>
                  </div>
                  <div className="col-8">
                    <div className="input-group">
                      <span className="input-group-text p-0" style={{"backgroundImage":`url(${options[type].image_url})`, "backgroundSize":"contain", "backgroundPosition": "center", "backgroundRepeat": "no-repeat"}}><div style={{"width": "3rem","height":"100%"}}></div></span>
                      <input name="image_url" defaultValue={options[type].image_url} onChange={handleOptionsChange} type="text" className="form-control" placeholder="Image URL"/>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Sound</label>
                  </div>
                  <div className="col-8">
                    <div className="input-group">
                      <span className="input-group-text p-0"><div className="d-flex justify-content-center align-items-center" style={{"width": "3rem","height": "100%"}}><i className="fas fa-music mauto" aria-hidden="true"></i></div></span>
                      <input name="sound_url" defaultValue={options[type].sound_url} onChange={handleOptionsChange} type="text" className="form-control" placeholder="Image URL"/>
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Volume</label>
                  </div>
                  <div className="col-8">
                    <div className="range">
                      <input name="sound_volume" defaultValue={options[type].sound_volume} onChange={handleOptionsChange} type="range" className="form-range" min="0" max="100" step="1" data-before="1" data-before-subfix="%"/>
                    </div>
                    </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Duration</label>
                  </div>
                  <div className="col-8">
                    <div className="range">
                      <input name="alert_duration" defaultValue={options[type].alert_duration} onChange={handleOptionsChange} type="range" className="form-range" min="2" max="300" step="1" data-before="1" data-before-subfix="s"/>
                    </div>
                    </div>
                </div>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Text delay</label>
                  </div>
                  <div className="col-8">
                    <div className="range">
                      <input name="alert_text_delay" defaultValue={options[type].alert_text_delay} onChange={handleOptionsChange} type="range" className="form-range" min="0" max="60" step="1" data-before="1" data-before-subfix="s"/>
                    </div>
                    </div>
                </div>
                <div className="card card-body"> 
                  <a data-mdb-toggle="collapse" href={`#${type}-FontSettingCollapse`} aria-expanded="false">
                    <i className="fas fa-plus-square me-1"></i> Font setting
                  </a> 
                  <div className="collapse" id={`${type}-FontSettingCollapse`}> 
                    <div className="p-2"></div>
                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-label mb-0">Font size</label>
                      </div>
                      <div className="col-8">
                        <div className="range">
                          <input name="font_size" defaultValue={options[type].font_size} onChange={handleOptionsChange} type="range" className="form-range" min="12" max="80" step="2" data-before="1" data-before-subfix=""/>
                        </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-label mb-0">Font weight</label>
                      </div>
                      <div className="col-8">
                        <div className="range">
                          <input name="font_weight" defaultValue={options[type].font_weight} onChange={handleOptionsChange} type="range" className="form-range" min="300" max="900" step="100" data-before="1" data-before-subfix=""/>
                        </div>
                        </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-label mb-0">Text color</label>
                      </div>
                      <div className="col-8">
                        <div className="input-group mb-3">
                          <span className="input-group-text p-0" style={{"backgroundColor":"#ffffff"}}><div style={{"width":"3rem"}}></div></span>
                          <input name="text_color" defaultValue={options[type].text_color} onChange={handleOptionsChange} type="text" className="form-control" placeholder="#ffffff" title="Set text color"/>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-4">
                        <label className="form-label mb-0">Hightlight color</label>
                      </div>
                      <div className="col-8">
                        <div className="input-group mb-3">
                          <span className="input-group-text p-0" style={{"backgroundColor":"#32c3a6"}}><div style={{"width":"3rem"}}></div></span>
                          <input name="text_highlight_color" defaultValue={options[type].text_highlight_color} onChange={handleOptionsChange} type="text" className="form-control" placeholder="#32c3a6" title="Set text color"/>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )})}
      </div>
    </div>
  </div>
  )
} 
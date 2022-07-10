import React, {Component} from "react";

export default class alertboxOptsLayout extends Component{
  constructor(props){
    super(props);
    this.options = this.props.opts; 
    this.intro = ["fade In","fade In Down","fade In Down Big","fade In Left","fade In Left Big","fade In Right","fade In Right Big","fade In Up","fade In Up Big","fade In Top Left","fade In Top Right","fade In Bottom Left","fade In Bottom Right","back In Down","back In Left","back In Right","back In Up","bounce In","bounce In Down","bounce In Left","bounce In Right","bounce In Up","flip In X","flip In Y","light Speed In Right","light Speed In Left","rotate In","rotate In Down Left","rotate In Down Right","rotate In Up Left","rotate In Up Right","roll In","zoom In","zoom In Down","zoom In Left","zoom In Right","zoom In Up","slide In Down","slide In Left","slide In Right","slide In Up"];
    this.outro = ["fade Out","fade Out Down","fade Out Down Big","fade Out Left","fade Out Left Big","fade Out Right","fade Out Right Big","fade Out Up","fade Out Up Big","fade Out Top Left","fade Out Top Right","fade Out Bottom Right","fade Out Bottom Left","back Out Down","back Out Left","back Out Right","back Out Up","bounce Out","bounce Out Down","bounce Out Left","bounce Out Right","bounce Out Up","flip Out X","flip Out Y","light Speed Out Right","light Speed Out Left","rotate Out","rotate Out Down Left","rotate Out Down Right","rotate Out Up Left","rotate Out Up Right","roll Out","zoom Out","zoom Out Down","zoom Out Left","zoom Out Right","zoom Out Up","slide Out Down","slide Out Left","slide Out Right","slide Out Up"];
  }
  
  componentDidMount(){
    
  }
  
  componentDidUpdate(){
    
  }
  
  handleChange(e){
    console.log(e.target.name, e.target.value)
  }
  
  render(){
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
                      <input onChange={this.handleChange} defaultValue={this.options.general.alert_delay} name="alert_delay" type="range" className="form-range" min="0" max="30" step="1" id="customRange3" />
                  </div>
                  </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label className="form-label mb-0">Parry alert</label>
                </div>
                <div className="col-8">
                  <div className="form-check d-inline-block">
                    <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="true" name="alert_parries"/>
                    <label className="form-check-label">
                      On
                    </label>
                  </div>
                  <div className="form-check d-inline-block ms-3">
                    <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="false" name="alert_parries" defaultChecked={true}/>
                    <label className="form-check-label">
                      Off
                    </label>
                  </div>
                </div>
              </div>
              <div className="row mb-3 parry_alert_delay" style={{"display":"none"}}>
                <div className="col-4">
                  <label className="form-label mb-0">Parry delay</label>
                </div>
                <div className="col-8">
                  <div className="range">
                    <input onChange={this.handleChange} name="parry_alert_delay" type="range" className="form-range" min="1" max="20" step="1" defaultValue="4" data-before="1" data-before-subfix="s"/>
                  </div>
                  </div>
              </div>
            </form>
          </div>
          {Object.keys(this.options).map((type, i) => {
            if(type === 'general' || type === "comment") return;
            let opt = this.options[type];
            return (
              <div key={type} className="tab-pane fade" id={`tab-${type}`} role="tabpanel">
                <form name={type} >
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Active</label>
                    </div>
                    <div className="col-8">
                      <div className="form-check d-inline-block">
                        <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="true" name="active" defaultChecked/>
                        <label className="form-check-label">
                          On
                        </label>
                      </div>
                      <div className="form-check d-inline-block ms-3">
                        <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="false" name="active"/>
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
                        <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="above" name="layout" defaultChecked/>
                        <label className="form-check-label">
                          Above
                        </label>
                      </div>
                      <div className="form-check d-inline-block ms-3">
                        <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="banner" name="layout"/>
                        <label className="form-check-label">
                          Banner
                        </label>
                      </div>
                      <div className="form-check d-inline-block ms-3">
                        <input onChange={this.handleChange} className="form-check-input" type="radio" defaultValue="side" name="layout"/>
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
                      <select className="form-select me-1" defaultValue="fadeInLeftBig" name="alert_animation_in">{
                        this.intro.map((e, i) => {
                          return (<option key={`alert_animation_in${i}`} value={e.replaceAll(' ','')}>{e}</option>)
                        }) 
                      }</select>
                      <select className="form-select ms-1" defaultValue="fadeOutLeftBig" name="alert_animation_out">{
                        this.outro.map((e, i) => {
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
                          <input onChange={this.handleChange} name="alert_min_amount" type="number" className="form-control" placeholder="1"/>
                        </div>
                      </div>
                    </div>) } 
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Template</label>
                    </div>
                    <div className="col-8"> 
                      <div className="input-group">
                        <input onChange={this.handleChange} name="message_template" type="text" className="form-control" 
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
                      <select defaultValue="wiggle" className="form-select me-2" name="text_animation">
                        <option defaultValue='wiggle'>Wiggle</option>
                        <option defaultValue="wave">Wave</option>
                        <option defaultValue="wobble">Wobble</option>
                        <option defaultValue="rubberBand">Rubberband</option>
                        <option defaultValue="bounce">Bounce</option>
                        <option defaultValue="tada">Tada</option>
                      </select>
                      <div className="fw-bold text-nowrap text-primary">
                        <span className="animated-letter wiggle">S</span>
                        <span className="animated-letter wiggle">A</span>
                        <span className="animated-letter wiggle">M</span>
                        <span className="animated-letter wiggle">P</span>
                        <span className="animated-letter wiggle">L</span>
                        <span className="animated-letter wiggle">E</span>
                        <span className="p-1"></span>
                        <span className="animated-letter wiggle">T</span>
                        <span className="animated-letter wiggle">E</span>
                        <span className="animated-letter wiggle">X</span>
                        <span className="animated-letter wiggle">T</span>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Image</label>
                    </div>
                    <div className="col-8">
                      <div className="input-group">
                        <span className="input-group-text p-0" style={{"backgroundImage":"url(https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif)", "backgroundSize":"contain", "backgroundPosition": "center", "backgroundRepeat": "no-repeat"}}><div style={{"width": "3rem","height":"100%"}}></div></span>
                        <input onChange={this.handleChange} name="image_url" type="text" className="form-control" placeholder="Image URL" defaultValue="https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif"/>
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
                        <input onChange={this.handleChange} name="sound_url" type="text" className="form-control" placeholder="Image URL" defaultValue="https://isetup.vn/tiktok/assets/sound/new-message-4.ogg"/>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Volume</label>
                    </div>
                    <div className="col-8">
                      <div className="range">
                        <input onChange={this.handleChange} name="sound_volume" type="range" className="form-range" min="0" max="100" step="1" defaultValue="50" data-before="1" data-before-subfix="%"/>
                      </div>
                      </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Duration</label>
                    </div>
                    <div className="col-8">
                      <div className="range">
                        <input onChange={this.handleChange} name="alert_duration" type="range" className="form-range" min="2" max="300" step="1" defaultValue="10" data-before="1" data-before-subfix="s"/>
                      </div>
                      </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <label className="form-label mb-0">Text delay</label>
                    </div>
                    <div className="col-8">
                      <div className="range">
                        <input onChange={this.handleChange} name="alert_text_delay" type="range" className="form-range" min="0" max="60" step="1" defaultValue="0" data-before="1" data-before-subfix="s"/>
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
                            <input onChange={this.handleChange} name="font_size" type="range" className="form-range" min="12" max="80" step="2" defaultValue="64" data-before="1" data-before-subfix=""/>
                          </div>
                          </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-4">
                          <label className="form-label mb-0">Font weight</label>
                        </div>
                        <div className="col-8">
                          <div className="range">
                            <input onChange={this.handleChange} name="font_weight" type="range" className="form-range" min="300" max="900" step="100" defaultValue="800" data-before="1" data-before-subfix=""/>
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
                            <input onChange={this.handleChange} name="text_color" type="text" className="form-control" placeholder="#ffffff" defaultValue="#ffffff"  title="Set text color"/>
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
                            <input onChange={this.handleChange} name="text_highlight_color" type="text" className="form-control" placeholder="#32c3a6" defaultValue="#32c3a6"  title="Set text color"/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )
          })}
        </div>
      </div>
    </div>
    )
  }
} 
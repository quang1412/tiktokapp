import React from "react";

export default function alertboxOptsLayout(data){
  const options = data.opts;
  var a = 1;
  
  const handleChange = e => {
    console.log(e.target)
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <ul className="nav nav-pills " id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button className="nav-link active" id="general" data-bs-toggle="pill" data-bs-target="#pills-general" type="button" role="tab" aria-controls="pills-general" aria-selected="true">General</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="gift" data-bs-toggle="pill" data-bs-target="#pills-gift" type="button" role="tab" aria-controls="pills-gift" aria-selected="false">Donate</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="follow" data-bs-toggle="pill" data-bs-target="#pills-follow" type="button" role="tab" aria-controls="pills-follow" aria-selected="false">Follow</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="like" data-bs-toggle="pill" data-bs-target="#pills-like" type="button" role="tab" aria-controls="pills-like" aria-selected="false">Like</button>
          </li>
          <li className="nav-item" role="presentation">
            <button className="nav-link" id="share" data-bs-toggle="pill" data-bs-target="#pills-share" type="button" role="tab" aria-controls="pills-share" aria-selected="false">Share</button>
          </li>
          <li className="ms-auto d-flex align-items-center">
            <button id="close-setting" className="btn btn-sm btn-light text-secondary border lh-1 p-2"><i className="fas fa-times-circle"></i></button>
          </li>
        </ul>
      </div>
      <div className="card-body text-start overflow-auto">
        <div className="tab-content " id="pills-tabContent">
          <div className="tab-pane fade show active" id="pills-general" role="tabpanel" aria-labelledby="general">
            <form name="general">
              <div className="row mb-3">
                <div className="col-4">
                  <label className="form-label mb-0">Alert delay</label>
                </div>
                <div className="col-8">
                  <div className="range">
                    <input defaultValue={options.general.alert_delay} onChange={handleChange} type="range" className="form-range" min="0" max="30" step="1" id="customRange3" />
                  </div>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-4">
                  <label className="form-label mb-0">Parry alert</label>
                </div>
                <div className="col-8">
                  <div className="form-check d-inline-block">
                    <input className="form-check-input" type="radio" defaultValue="true" name="alert_parries" onChange={handleChange} />
                    <label className="form-check-label">
                      On
                    </label>
                  </div>
                  <div className="form-check d-inline-block ms-3">
                    <input className="form-check-input" type="radio" defaultValue="false" name="alert_parries" onChange={handleChange} checked/>
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
                  <input name="parry_alert_delay" type="range" className="form-range" min="1" max="20" step="1" defaultValue="4" onChange={handleChange} data-before="1" data-before-subfix="s"/>
                </div>
              </div>
            </form>
          </div>
          {Object.keys(options).forEach(type => {
            let opts = options[type]
            Object.keys(opts).forEach(name => (
              <br/>
            )) 
          })}
        </div>
      </div>
    </div>
  );
};


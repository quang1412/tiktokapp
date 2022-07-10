import React from "react";

export default function alertboxOptsLayout(data){
  const options = data.opts; 
  
  const handleChange = e => {
    console.log(e.target)
  }
  
  return (
    <div className="card">
      <div className="card-header">
        <ul className="nav nav-tabs" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button class="nav-link active" data-mdb-toggle="tab" href="#tab-general" role="tab" aria-controls="tab-general" aria-selected="true">General</button>
          </li>
          <li className="nav-item" role="presentation">
            <button class="nav-link" data-mdb-toggle="tab" href="#tab-gift" role="tab" aria-controls="tab-gift" aria-selected="false">Donate</button>
          </li>
          <li className="nav-item" role="presentation">
            <button class="nav-link" data-mdb-toggle="tab" href="#tab-follow" role="tab" aria-controls="tab-follow" aria-selected="false">Follow</button>
          </li>
          <li className="nav-item" role="presentation">
            <button class="nav-link" data-mdb-toggle="tab" href="#tab-like" role="tab" aria-controls="tab-like" aria-selected="false">Like</button>
          </li>
          <li className="nav-item" role="presentation">
            <button class="nav-link" data-mdb-toggle="tab" href="#tab-share" role="tab" aria-controls="tab-share" aria-selected="false">Share</button>
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
                    <input className="form-check-input" type="radio" defaultValue="false" name="alert_parries" onChange={handleChange} defaultChecked={true}/>
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
          {Object.keys(options).map((type, i) => {
            if(type == 'general') return;
            return (
              <div className="tab-pane fade" id={`tab-${type}`} role="tabpanel">

              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};


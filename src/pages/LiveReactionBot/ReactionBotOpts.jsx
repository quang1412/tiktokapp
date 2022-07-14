import React  from "react";

export default function ReactionBotOpts(props){
  const options = props.options;
  const handleOptionsChange = props.handleOptionsChange;
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
          <button onClick={e => {props.setLayer("play")}} className="btn btn-lg btn-light position-fixed top-0 end-0 text-primary lh-1 p-2 m-3" style={{"zIndex":"1"}}><i className="fas fa-times-circle"></i></button>
        </li>
      </ul>
    </div>
    <div className="card-body text-start overflow-auto">
      <div className="tab-content pt-3" id="pills-tabContent">
        <div className="tab-pane fade show active" id="tab-general" role="tabpanel" aria-labelledby="general">
          <form name="general">
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label mb-0">Language</label>
              </div>
              <div className="col-8">
                <select name="lang"  defaultValue={options.general.lang} onChange={handleOptionsChange} className="form-select me-2" title="use arrow key to navigate through list, and enter key to select">
                  <option value='vi'>Vietnamese</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div> 
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label mb-0">Page title</label>
              </div>
              <div className="col-8">
                <div className="input-group">
                  <input name="pageTitle" defaultValue={options.general.pageTitle} onChange={handleOptionsChange} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping" />
                </div> 
              </div>
            </div> 
            <div className="row mb-3">
              <div className="col-4">
                <label className="form-label mb-0">Delay</label>
              </div>
              <div className="col-8">
                <div className="range">
                  <input name="delay" defaultValue={options.general.delay} onChange={handleOptionsChange} type="range" className="form-range" min="1" max="30" step="1" />
                </div>
              </div>
            </div> 
          </form>
        </div>
        {Object.keys(options).map(function(type, i){
          if(type !== "general"){ return (
            <div key={type} className="tab-pane fade" id={`tab-${type}`} role="tabpanel">
              <form name={type}>
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Active</label>
                  </div>
                  <div className="col-8">
                    <div className="form-check form-check-inline">
                      <input name="active" defaultValue="true" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={options[type].active}/>
                      <label className="form-check-label">Enable</label>
                    </div> 
                    <div className="form-check form-check-inline">
                      <input name="active" defaultValue="false" onChange={handleOptionsChange} className="form-check-input" type="radio" defaultChecked={!options[type].active}/>
                      <label className="form-check-label">Disable</label>
                    </div>
                  </div>
                </div> 
                <div className="row mb-3">
                  <div className="col-4">
                    <label className="form-label mb-0">Voice Template</label>
                  </div>
                  <div className="col-8">
                    <div className="input-group">
                      <input name="pageTitle" defaultValue={options[type].voiceTemp} onChange={handleOptionsChange} type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="addon-wrapping"/>
                    </div>
                    <small>
                      {type === 'gift' ? "keys: {nickname} / {username} / {giftname} / {giftcount} / {amount}" : 
                      type === 'like' ? "keys: {nickname} / {username} / {likecount}" : 
                      type === 'share' ? "keys: {nickname} / {username}" : 
                      type === 'follow' ? "keys: {nickname} / {username}" : type}
                    </small>
                  </div>
                </div> 
              </form>
            </div>
          ) }
        })}
        </div>
      </div>
    </div>
    )
}
import React from "react";

export default function alertboxOptsLayout(data){
  const options = data.opts;
  return (
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-pills " id="pills-tab" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="general" data-bs-toggle="pill" data-bs-target="#pills-general" type="button" role="tab" aria-controls="pills-general" aria-selected="true">General</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="gift" data-bs-toggle="pill" data-bs-target="#pills-gift" type="button" role="tab" aria-controls="pills-gift" aria-selected="false">Donate</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="follow" data-bs-toggle="pill" data-bs-target="#pills-follow" type="button" role="tab" aria-controls="pills-follow" aria-selected="false">Follow</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="like" data-bs-toggle="pill" data-bs-target="#pills-like" type="button" role="tab" aria-controls="pills-like" aria-selected="false">Like</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="share" data-bs-toggle="pill" data-bs-target="#pills-share" type="button" role="tab" aria-controls="pills-share" aria-selected="false">Share</button>
          </li>
          <li class="ms-auto d-flex align-items-center">
            <button id="close-setting" class="btn btn-sm btn-light text-secondary border lh-1 p-2"><i class="fas fa-times-circle"></i></button>
          </li>
        </ul>
      </div>
      <div class="card-body text-start overflow-auto">
        <div class="tab-content" id="pills-tabContent">
          <div class="tab-pane fade show active" id="pills-general" role="tabpanel" aria-labelledby="general">
            <form name="general">
              <div class="row mb-3">
                <div class="col-4">
                  <label class="form-label mb-0">Alert delay</label>
                </div>
                <div class="col-8">
                  <input name="alert_delay" type="range" class="form-range" min="0" max="30" step="1" value={options.general.alert_delay} data-before="1" data-before-subfix="s"/>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col-4">
                  <label class="form-label mb-0">Parry alert</label>
                </div>
                <div class="col-8">
                  <div class="form-check d-inline-block">
                    <input class="form-check-input" type="radio" value="true" name="alert_parries" onchange="$('.parry_alert_delay').show()"/>
                    <label class="form-check-label">
                      On
                    </label>
                  </div>
                  <div class="form-check d-inline-block ms-3">
                    <input class="form-check-input" type="radio" value="false" name="alert_parries" onchange="$('.parry_alert_delay').hide()" checked/>
                    <label class="form-check-label">
                      Off
                    </label>
                  </div>
                </div>
              </div>
              <div class="row mb-3 parry_alert_delay" style="display:none;">
                <div class="col-4">
                  <label class="form-label mb-0">Parry delay</label>
                </div>
                <div class="col-8">
                  <input name="parry_alert_delay" type="range" class="form-range" min="1" max="20" step="1" value="4" data-before="1" data-before-subfix="s"/>
                </div>
              </div>
            </form>
          </div>
          {options.map((o, i) => (
            <br/>
          ))}
        </div>
      </div>
    </div>
  );
};


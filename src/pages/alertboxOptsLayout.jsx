import React from "react";

export default function alertboxOptsLayout(){
  return (
    <form name=<%= type %> >
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Active</label>
        </div>
        <div class="col-8">
          <div class="form-check d-inline-block">
            <input class="form-check-input" type="radio" value="true" name="active" checked>
            <label class="form-check-label">
              On
            </label>
          </div>
          <div class="form-check d-inline-block ms-3">
            <input class="form-check-input" type="radio" value="false" name="active">
            <label class="form-check-label">
              Off
            </label>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Layout</label>
        </div>
        <div class="col-8">
          <div class="form-check d-inline-block">
            <input class="form-check-input" type="radio" value="above" name="layout" checked>
            <label class="form-check-label">
              Above
            </label>
          </div>
          <div class="form-check d-inline-block ms-3">
            <input class="form-check-input" type="radio" value="banner" name="layout">
            <label class="form-check-label">
              Banner
            </label>
          </div>
          <div class="form-check d-inline-block ms-3">
            <input class="form-check-input" type="radio" value="side" name="layout">
            <label class="form-check-label">
              Side
            </label>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Effects</label>
        </div>
        <div class="col-8 d-flex">
          <select class="form-select me-1" name="alert_animation_in">
            <% var intro = ["fade In","fade In Down","fade In Down Big","fade In Left","fade In Left Big","fade In Right","fade In Right Big","fade In Up","fade In Up Big","fade In Top Left","fade In Top Right","fade In Bottom Left","fade In Bottom Right","back In Down","back In Left","back In Right","back In Up","bounce In","bounce In Down","bounce In Left","bounce In Right","bounce In Up","flip In X","flip In Y","light Speed In Right","light Speed In Left","rotate In","rotate In Down Left","rotate In Down Right","rotate In Up Left","rotate In Up Right","roll In","zoom In","zoom In Down","zoom In Left","zoom In Right","zoom In Up","slide In Down","slide In Left","slide In Right","slide In Up"] %>
            <% intro.forEach(function(name){ %>
              <option value=<%= name.replaceAll(' ', '') %> ><%= name %></option>
            <% }) %>
          </select>
          <select class="form-select ms-1" name="alert_animation_out">
            <% var outro = ["fade Out","fade Out Down","fade Out Down Big","fade Out Left","fade Out Left Big","fade Out Right","fade Out Right Big","fade Out Up","fade Out Up Big","fade Out Top Left","fade Out Top Right","fade Out Bottom Right","fade Out Bottom Left","back Out Down","back Out Left","back Out Right","back Out Up","bounce Out","bounce Out Down","bounce Out Left","bounce Out Right","bounce Out Up","flip Out X","flip Out Y","light Speed Out Right","light Speed Out Left","rotate Out","rotate Out Down Left","rotate Out Down Right","rotate Out Up Left","rotate Out Up Right","roll Out","zoom Out","zoom Out Down","zoom Out Left","zoom Out Right","zoom Out Up","slide Out Down","slide Out Left","slide Out Right","slide Out Up"] %>
            <% outro.forEach(function(name){ %>
              <option value=<%= name.replaceAll(' ', '') %> ><%= name %></option>
            <% }) %>
          </select>
        </div>
      </div>
      <% if (type=='gift') { %>
        <div class="row mb-3">
          <div class="col-4">
            <label class="form-label mb-0">Min. donate</label>
          </div>
          <div class="col-8">
            <div class="input-group w-50">
              <input name="alert_min_amount" type="number" class="form-control" placeholder="1">
            </div>
          </div>
        </div>
      <% } %>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Template</label>
        </div>
        <div class="col-8">
          <% if(type=='gift'){%>
            <div class="input-group">
              <input name="message_template" type="text" class="form-control" placeholder="{username} send {giftcount} {giftname}">
            </div>
            <small>Keys: {nickname} / {username} / {giftname} / {giftcount} / {amount}</small>
          <% } %>
          <% if(type=='follow'){%>
            <div class="input-group">
              <input name="message_template" type="text" class="form-control" placeholder="{username} followed host">
            </div>
            <small>Keys: {nickname} / {username}</small>
          <% } %>
          <% if(type=='like'){%>
            <div class="input-group">
              <input name="message_template" type="text" class="form-control" placeholder="{username} send {likecount} like">
            </div>
            <small>Keys: {nickname} / {username} / {likecount}</small>
          <% } %>
          <% if(type=='share'){%>
            <div class="input-group">
              <input name="message_template" type="text" class="form-control" placeholder="{username} shared host">
            </div>
            <small>Keys: {nickname} / {username}</small>
          <% } %>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Text effect</label>
        </div>
        <div class="col-8 d-flex align-items-center">
          <select class="form-select me-2" name="text_animation">
            <option value='wiggle' selected>Wiggle</option>
            <option value="wave">Wave</option>
            <option value="wobble">Wobble</option>
            <option value="rubberBand">Rubberband</option>
            <option value="bounce">Bounce</option>
            <option value="tada">Tada</option>
          </select>
          <div class="fw-bold text-nowrap">
            <span class="animated-letter wiggle">S</span>
            <span class="animated-letter wiggle">A</span>
            <span class="animated-letter wiggle">M</span>
            <span class="animated-letter wiggle">P</span>
            <span class="animated-letter wiggle">L</span>
            <span class="animated-letter wiggle">E</span>
            <span class="">&nbsp</span>
            <span class="animated-letter wiggle">T</span>
            <span class="animated-letter wiggle">E</span>
            <span class="animated-letter wiggle">X</span>
            <span class="animated-letter wiggle">T</span>
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Image</label>
        </div>
        <div class="col-8">
          <div class="input-group">
            <span class="input-group-text p-0" style="background-image:url(https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif);background-size: contain;background-position: center;background-repeat: no-repeat;"><div style="width: 3rem;height: 100%;"></div></span>
            <input name="image_url" type="text" class="form-control" placeholder="Image URL" value="https://isetup.vn/tiktok/assets/gif/jumpy-t-rex.gif">
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Sound</label>
        </div>
        <div class="col-8">
          <div class="input-group">
            <span class="input-group-text p-0"><div class="d-flex justify-content-center align-items-center" style="width: 3rem;height: 100%;"><i class="fas fa-music mauto" aria-hidden="true"></i></div></span>
            <input name="sound_url" type="text" class="form-control" placeholder="Image URL" value="https://isetup.vn/tiktok/assets/sound/new-message-4.ogg">
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Volume</label>
        </div>
        <div class="col-8">
          <input name="sound_volume" type="range" class="form-range" min="0" max="100" step="1" value="50" data-before="1" data-before-subfix="%">
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Duration</label>
        </div>
        <div class="col-8">
          <input name="alert_duration" type="range" class="form-range" min="2" max="300" step="1" value="10" data-before="1" data-before-subfix="s">
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-4">
          <label class="form-label mb-0">Text delay</label>
        </div>
        <div class="col-8">
          <input name="alert_text_delay" type="range" class="form-range" min="0" max="60" step="1" value="0" data-before="1" data-before-subfix="s">
        </div>
      </div>
      <div class="card card-body"> 
        <a data-bs-toggle="collapse" href="#<%=type%>FontSettingCollapse" aria-expanded="false">
          <i class="fas fa-plus-square me-1"></i> Font setting
        </a> 
        <div class="collapse" id="<%=type%>FontSettingCollapse"> 
          <div class="p-2"></div>
          <div class="row mb-3">
            <div class="col-4">
              <label class="form-label mb-0">Font size</label>
            </div>
            <div class="col-8">
              <input name="font_size" type="range" class="form-range" min="12" max="80" step="2" value="64" data-before="1" data-before-subfix="">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-4">
              <label class="form-label mb-0">Font weight</label>
            </div>
            <div class="col-8">
              <input name="font_weight" type="range" class="form-range" min="300" max="900" step="100" value="800" data-before="1" data-before-subfix="">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-4">
              <label class="form-label mb-0">Text color</label>
            </div>
            <div class="col-8">
              <div class="input-group mb-3">
                <span class="input-group-text p-0" style="background-color:#ffffff"><div style="width:3rem"></div></span>
                <input name="text_color" type="text" class="form-control" placeholder="#ffffff" value="#ffffff"  title="Set text color">
              </div>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-4">
              <label class="form-label mb-0">Hightlight color</label>
            </div>
            <div class="col-8">
              <div class="input-group mb-3">
                <span class="input-group-text p-0" style="background-color:#32c3a6"><div style="width:3rem"></div></span>
                <input name="text_highlight_color" type="text" class="form-control" placeholder="#32c3a6" value="#32c3a6"  title="Set text color">
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Layout;
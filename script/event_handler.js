function while_load(img){
  if(!img.complete){
    img.style.visibility = "hidden";
    let parent_div = get_parent_elem(img, "div");
    parent_div.style.backgroundColor = "#D3D3D3";
  }
};

function after_load(img){
  img.style.visibility = "visible";
  let parent_div = get_parent_elem(img, "div");
  parent_div.style.backgroundColor = "transparent";
};

function scroll_change(){
  function check_to_pause_game(){
    let scrollTop = window.pageYOffset;
    if(gol.offsetTop+gol.clientHeight < scrollTop){pause_game();}
  }
  lazyload();
  check_to_pause_game();
  set_background_of_header_to_section();
}
function width_change(){
  lazyload();
  generate_navbar();
  set_background_of_header_to_section();
  change_pages_dimensions();
  game_of_life.board.add_cells_on_resize();
}

function get_complement_color(){
  if(sessionStorage["current_mode"] == "black"){return "white";}
  else{return "black";}
}

function set_background_of_header_to_section(){
  function change_background_of_header_div(section_div){
    function change_background(header_div, btn_color, div_color, data_viewed_val){
      header_div.firstElementChild.style.color = btn_color;
      header_div.style.backgroundColor = div_color;
      header_div.setAttribute("data-is_viewed", data_viewed_val);
    }
    function remove_background_of_not_viewed(header_viewed, header_div){
      for(let i=0; i<header_div.length; ++i){
        if(header_div[i] != header_viewed && header_div[i].getAttribute("data-is_viewed") == "1"){
          change_background(header_div[i], get_complement_color(), sessionStorage["current_mode"], "0");
          break;
        }
      }
    }
    let header_div = document.getElementsByClassName("header_a_wrapper");
    for(let i=0; i<header_div.length; ++i){
      if(header_div[i].getAttribute("data-section_id") == section_div.id){
        change_background(header_div[i], sessionStorage["current_mode"], get_complement_color(), "1");
        remove_background_of_not_viewed(header_div[i], header_div);
        break;
      }
    }
  }
  var page_middle =  window.pageYOffset+(window.outerHeight/2);
  for(let i=0; i<all_sections.length; ++i){
    if(page_middle > all_sections[i].offsetTop && page_middle < (all_sections[i].offsetTop+all_sections[i].clientHeight)){
      change_background_of_header_div(all_sections[i]);
    }
  }
}

function change_pages_dimensions(){
  function height_of_sections(){
    function change_heights_of(class_elem, height_px){
      for(let i=0; i<class_elem.length; ++i){
        class_elem[i].style.height = height_px;
      }
    }

    let placeholders = document.getElementsByClassName("placeholder");
    let placeholder_height = document.getElementById("header").clientHeight;
    change_heights_of(placeholders, placeholder_height+"px");

    let sections = document.getElementsByClassName("section_info");
    let section_height = (window.outerHeight - (2*placeholder_height));
    change_heights_of(sections, section_height+"px");

    let controls_height = document.getElementById("game_controls").clientHeight;
    let wrapper_height = window.innerHeight-(placeholder_height+controls_height);
    document.getElementById("explanation_wrapper").style.height = wrapper_height+"px";
    document.getElementById("explanation_wrapper").style.top = placeholder_height+"px";
  }
  function height_of_game_div(){
    document.getElementById("game_display_div").style.height = window.innerHeight-(document.getElementById("header").clientHeight+document.getElementById("game_controls").clientHeight)+"px";
  }
  height_of_sections();
  height_of_game_div();
}

function lazyload() {
  if(lazyloadThrottleTimeout) {clearTimeout(lazyloadThrottleTimeout);}
  else if(start_game_timeout){clearTimeout(start_game_timeout);}

  lazyloadThrottleTimeout = setTimeout(function() {
      var scrollTop = window.pageYOffset;

      for(let i=0; i<lazyloadImages.length; ++i){
        let img = lazyloadImages[i];
        if(img.offsetTop < (window.outerHeight + scrollTop)) {
          let datasrc = img.dataset.src.split("_")[0];
          add_event_listener_to_load(img);
          img.src = datasrc+"_"+sessionStorage["current_mode"]+".png";
          img.classList.remove('lazy');
        }
      }
  }, 20);
}

function generate_navbar() {
  function set_border_top_of_header_vals(border_val){
    let header_vals = document.getElementsByClassName("header_a_wrapper");
    for(let i=0; i<header_vals.length; ++i){header_vals[i].style.borderTop=border_val;}
  }

  function create_mobile_navbar(){
    document.getElementById("header_div").style.display ="none";
    set_border_top_of_header_vals("solid "+get_complement_color()+" thin");
    document.getElementById("navbar_symbol").style.display = "inline";

    let navbar_img = document.getElementById("navbar_symbol");
    navbar_img.setAttribute("src", "documents/navbarsymbol_"+sessionStorage["current_mode"]+".png");
    navbar_img.setAttribute("onclick", "open_navbar(this)");
    add_event_listener_to_load(navbar_img);
  }

  var med = window.matchMedia("(max-width: 720px)");
  if (med.matches) {
    create_mobile_navbar();
  }
  else{
    document.getElementById("header_div").style.display ="flex";
    set_border_top_of_header_vals("none");
    document.getElementById("navbar_symbol").style.display = "none";
  }
}

function open_navbar(img){
  document.getElementById("header_div").style.display = "block";
  img.setAttribute("src", "documents/close_"+sessionStorage["current_mode"]+".png");
  img.setAttribute("onclick", "close_navbar(this)");
  add_event_listener_to_load(img);
}

function close_navbar(img){
  document.getElementById("header_div").style.display ="none";
  img.setAttribute("src", "documents/navbarsymbol_"+sessionStorage["current_mode"]+".png");
  img.setAttribute("onclick", "open_navbar(this)");
  add_event_listener_to_load(img);
}

function add_event_listener_to_load(img){
  img.addEventListener('loadstart', while_load(img));
  img.onload = function(){after_load(img);}
}

function jump_to(page_id){
  window.location.href="#"+page_id;
  if(window.matchMedia("(max-width: 720px)").matches){
    close_navbar(document.getElementById("navbar_symbol"));
  }
}

function get_parent_elem(img, parent_to_find){
  let parent_elem = img.parentNode;
  if(parent_elem==null){return img;}
  let first_char = parent_to_find.charAt(0);
  if(first_char == "#"){
    while(parent_elem != null && parent_elem.id != parent_to_find.substring(1)){
      parent_elem = parent_elem.parentElement;
    }
  }
  else if(first_char == "."){
    while(parent_elem != null && parent_elem.className != parent_to_find.substring(1)){
      parent_elem = parent_elem.parentElement;
    }
  }
  else{
    while(parent_elem != null && parent_elem.tagName != parent_to_find.toUpperCase()){
      parent_elem = parent_elem.parentElement;
    }
  }
  return parent_elem;
}

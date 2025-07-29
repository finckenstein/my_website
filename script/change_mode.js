class ThemeSwitch{
  constructor(){
    this.mode = sessionStorage["current_mode"] || "white";
    this.init();
  }

  init(){
    this.change_mode_display(this.mode);
    this.change_color_of_page(this.mode, this.mode === "white" ? "black" : "white");
    sessionStorage["current_mode"] = this.mode;
  }
}

function change_mode_display(mode){
  if(document.getElementById("display_mode") != null){document.getElementById("display_mode").remove();}
  let mode_display = document.createElement("p");
  mode_display.setAttribute("data-localize", "header."+mode);
  mode_display.setAttribute("id", "display_mode");
  document.getElementById("mode_switch").appendChild(mode_display);
  translate_txt();
}

function change_tags_color(tag, txt_color){
  let tags = document.getElementsByTagName(tag);
  for(let i=0; i<tags.length; ++i){tags[i].style.color = txt_color;}
}

function change_txt_link(txt_color){
  let links = document.getElementsByClassName("txt_link");
  for(let i=0; i<links.length; ++i){
    links[i].style.color = txt_color;
  }
}

function change_index_page(txt_color, background_color){

  function change_header(){
    let header = document.getElementById("header");
    header.style.borderBottom = "solid "+txt_color+" thin";
    let header_color = document.portfolio_functionality.get_header_color(background_color);

    header.style.backgroundColor = header_color;
    let header_div = document.getElementsByClassName("header_a_wrapper");
    for(let i=0;i<header_div.length; ++i){
      if(header_div[i].getAttribute("data-is_viewed") == "1"){
        header_div[i].style.backgroundColor = txt_color;
        header_div[i].firstElementChild.style.color = background_color;
      }
      else{header_div[i].style.backgroundColor = header_color;}
      if(window.matchMedia("(max-width: 720px)").matches){
        header_div[i].style.borderTop = "solid "+txt_color+" thin";
      }
    }
  }

  function change_game_section(){
    function change_controls_btn_backgrouncolor(){
      let dict;
      if(txt_color == "black"){
        dict = {start_game: "#cbffc0", pause_game: "#ffe5c0", stop_game:"#ffc0c0",
        draw_cells: "#c0c9ff", erase_cells: "#dfc0ff", game_explanation: "#ccc",
        hide_game_explanation:"#ffc0c0"};
        change_btn_color_to(dict);
      }
      else{
        dict = {start_game: "#126400", pause_game: "#945700", stop_game:"#680000",
        draw_cells: "#000c51", erase_cells: "#3b0079", game_explanation: "#272727",
        hide_game_explanation:"#680000"};
        change_btn_color_to(dict);
      }
      function change_btn_color_to(dict){
        for(let key in dict){document.getElementById(key).style.backgroundColor = dict[key];}
      }
    }
    let buttons = document.getElementsByClassName("btn_border");
    for(let i=0; i<buttons.length; ++i){
      buttons[i].style.border = "solid "+txt_color+" thin";
    }

    document.gol_game_ui.board.change_color_of_cells(txt_color, background_color);
    change_controls_btn_backgrouncolor(txt_color);

    document.getElementById("game_explanation_txt").style.backgroundColor = background_color;
    document.getElementById("game_explanation_txt").style.border = "solid "+txt_color+" thin";
  }

  function change_about_me_section(){
    function change_img(id){
      let img = document.getElementById(id);
      let attr;
      if (img.getAttribute("src") != null){attr = "src";}
      else{attr = "data-src";}
      let src = img.getAttribute(attr).split("/")[1].split("_")[0];
      img.setAttribute(attr, "documents/"+src+"_"+background_color+".png");
      img.onload = function(){document.portfolio_functionality.after_load(img);}
    }
    change_img("mail");
    change_img("github");
    change_img("linkedin");
    change_img("navbar_symbol");
    document.getElementById("profile_pic").style.border = "solid "+txt_color;
  }

  function general_changes(){
    let holder_color;
    if(background_color=="white"){holder_color="#2B5A85";}
    else{holder_color="#10263b";}

    let placeholders = document.getElementsByClassName("placeholder");
    for(let i=0; i<placeholders.length; ++i){placeholders[i].style.backgroundColor = holder_color;}

    let sec = document.getElementsByTagName("section");
    for(let i=0; i<sec.length; ++i){
      sec[i].style.borderTop = "solid "+txt_color+" thin";
      sec[i].style.borderBottom = "solid "+txt_color+" thin";
    }

    document.getElementById("body_of_all").style.backgroundColor = background_color;
    document.querySelectorAll('[data-localize]').forEach(elem => {elem.style.color = txt_color;});

    change_txt_link(txt_color);

    change_tags_color("p", txt_color);
    change_tags_color("a", txt_color);
    change_tags_color("h2", txt_color);
    change_tags_color("button", txt_color);
  }

  function change_project_section(){
    let projects = document.getElementsByClassName("project");
    for(i=0; i<projects.length; ++i){projects[i].style.borderBottom = "solid "+txt_color+" thin";}
  }

  general_changes();
  change_header();
  change_game_section();
  change_about_me_section();
  change_project_section();
}

function change_project_page(txt_color, background_color){
  document.getElementById("project").style.backgroundColor = background_color;
  change_txt_link(txt_color);
  document.querySelectorAll('[data-localize]').forEach(elem => {elem.style.color = txt_color;});
  change_tags_color("button", txt_color);
  document.getElementById("p_back_btn").style.backgroundColor = background_color;
}

function change_color_of_page(txt_color, background_color){
  let loc = window.location.href.split("/");
  let page = loc[loc.length-1].split(".")[0];
  if(page == "single_project"){change_project_page(txt_color, background_color);}
  else{change_index_page(txt_color, background_color);}
}

function change_mode(){
  if(sessionStorage["current_mode"] == "white"){
    change_mode_display("dark");
    change_color_of_page(sessionStorage["current_mode"], "black");
    sessionStorage["current_mode"] = "black";
  }
  else{
    change_mode_display("light");
    change_color_of_page(sessionStorage["current_mode"], "white");
    sessionStorage["current_mode"] = "white";
  }
}

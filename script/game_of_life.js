var board = new GameBoard();
var game_of_life = new GameLogic(board);

var mouse_down = false;
var intreval_time = document.getElementById("intreval_time").value;

function start_game(){
  if(!game_of_life.intreval_id){
    change_opacity("0.25", "1", "1");
    game_of_life.intreval_id = setInterval(()=>{game_of_life.game_logic();}, intreval_time);
  }
}

function pause_game(){
  change_opacity("1", "0.25", "1");
  if(game_of_life.intreval_id){
    clearInterval(game_of_life.intreval_id);
  }
  game_of_life.intreval_id = null;
}

function stop_game(){
  pause_game();
  change_opacity("1", "0.25", "0.25");
  board.reset();
}

function take_screen_shot(){
  board.get_all_alive_cells();
}

function change_opacity(o_start, o_pause, o_stop){
  document.getElementById("start_game").style.opacity = o_start;
  document.getElementById("pause_game").style.opacity = o_pause;
  document.getElementById("stop_game").style.opacity = o_stop;
}

function change_background_mouse_down(selected_div){
  if (mouse_down){board.set_cell_alive(selected_div);}
}

function change_background(selected_div){
  if (selected_div.getAttribute("data-is_alive") == 1){board.kill_cell(selected_div);}
  else{board.set_cell_alive(selected_div);}
}

document.getElementById("game").onmousedown = ()=>{mouse_down = true;};
document.getElementById("game").onmouseup = ()=>{mouse_down = false;}

document.getElementById("intreval_time").onmouseup = ()=>{change_display_of_range();};

function change_display_of_range(){
  pause_game();
  intreval_time = document.getElementById("intreval_time").value;
  start_game();
  document.getElementById("show_intreval_time").textContent = ((document.getElementById("intreval_time").value)/1000)+" sec";
}

var placeHolders = document.getElementsByClassName("placeholder");
let height = document.getElementById("header").clientHeight;
for(let i=0; i<placeHolders.length; ++i){
  placeHolders[i].style.height = height + "px";
}

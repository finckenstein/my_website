class GameBoard{
  constructor(){
    let tmp_dim = this.get_div_dim();
    this.game_board = document.getElementById("game_display");
    this.screen_height = Math.floor((window.innerHeight-(document.getElementById("header").clientHeight+document.getElementById("game_controls").clientHeight))/tmp_dim);
    this.screen_width =  Math.floor(window.innerWidth/tmp_dim);
    if(this.screen_height > 125 &&(this.screen_height+this.screen_width)>250){
      this.screen_height = 125;
    }
    if(this.screen_width > 120 &&(this.screen_height+this.screen_width)>250){
      this.screen_width = 125;
    }
    if(this.screen_height < 14){this.screen_height = 13;}
    if(this.screen_width < 14){this.screen_width = 13;}

    this.div_dim = tmp_dim+"px";
    this.div_attribute = "data-is_alive";
    this.initialize(true, null);
  }

  get_div_dim(){
    if(window.matchMedia("(max-width: 550px)").matches){return 12.75;}
    else if(window.matchMedia("(max-width: 1050px) and (min-width: 551px)").matches){return 14;}
    else if(window.matchMedia("(max-width: 1700px) and (min-width: 1051px)").matches){return 15;}
    else{return 20;}
  }

  initialize(draw_starting_pattern, alive_cells){
    this.divs_to_game_board(draw_starting_pattern, alive_cells);
    this.draw_grid();
  }

  divs_to_game_board(draw_starting_pattern, alive_cells){
    this.div_dim = this.get_div_dim()+"px";
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let tmp_div = document.createElement("div");

        tmp_div.style.border = "solid thin grey";
        tmp_div.style.width = this.div_dim;
        tmp_div.style.height = this.div_dim;

        tmp_div.setAttribute("id", x+" "+y);
        tmp_div.setAttribute("onclick", "change_background(this)");
        tmp_div.setAttribute("onmousemove", "change_background_mouse_down(this)");

        if(alive_cells != null && (alive_cells.includes(x+" "+y))){
          this.set_cell_alive(tmp_div);
        }
        else{
          this.kill_cell(tmp_div);
        }
        this.game_board.appendChild(tmp_div);
      }
    }
    if(draw_starting_pattern){get_data(this);}
  }
  get_coordinate_array(pattern, index){
    let x_coor = [];
    pattern.forEach(coor => {
      x_coor.push(Number(coor.split(" ")[index]));
    });
    return x_coor;
  }
  find_min_max(pattern, index, callback){return callback(...this.get_coordinate_array(pattern, index));}
  get_median(pattern, index){
    let coordinates = this.get_coordinate_array(pattern, index);
    coordinates.sort();
    return coordinates[Math.floor(coordinates.length/2)];
  }

  translate_to_min(curr, bound, min, trans){
    if(curr == min){return (bound + trans);}
    else{return ((curr - min)+ trans);}
  }
  translate_to_max(curr, bound, max, trans){
    if(curr == max){return (bound - trans);}
    else{return (bound - (max - curr) - trans);}
  }
  get_left(x_coor, x_translate, x_bound){return this.translate_to_min(x_coor, 0, x_bound, x_translate);}
  get_right(x_coor, x_translate, x_bound){return this.translate_to_max(x_coor, this.screen_width-1, x_bound, x_translate);}
  get_top(y_coor, y_translate, y_bound){return this.translate_to_min(y_coor, 0, y_bound, y_translate);}
  get_bottom(y_coor, y_translate, y_bound){return this.translate_to_max(y_coor, this.screen_height-1, y_bound, y_translate);}
  get_middle(coordinate, pattern_median, board_middle, trans){
    let val;
    if(coordinate==pattern_median){val=board_middle+trans;}
    else if(coordinate<pattern_median){val=(board_middle-(pattern_median-coordinate))+trans;}
    else if(coordinate>pattern_median){val=(board_middle+(coordinate-pattern_median))+trans;}
    return val;
  }
  position_elements(pattern, x_translate, y_translate, pos){
    let x;
    let y;
    let pattern_to_start = [];
    let x_min_of_pattern = this.find_min_max(pattern,0,Math.min);
    let x_max_of_pattern = this.find_min_max(pattern,0,Math.max);
    let y_min_of_pattern = this.find_min_max(pattern,1,Math.min);
    let y_max_of_pattern = this.find_min_max(pattern,1,Math.max);
    let x_median = this.get_median(pattern,0);
    let y_median = this.get_median(pattern,1);

    pattern.forEach(cell => {
      if(pos == "tl"){
        x = this.get_left(Number(cell.split(" ")[0]), x_translate, x_min_of_pattern);
        y = this.get_top(Number(cell.split(" ")[1]), y_translate, y_min_of_pattern);
      }
      else if(pos == "tr"){
        x = this.get_right(Number(cell.split(" ")[0]), x_translate, x_max_of_pattern);
        y = this.get_top(Number(cell.split(" ")[1]), y_translate, y_min_of_pattern);
      }
      else if(pos == "br"){
        x = this.get_right(Number(cell.split(" ")[0]), x_translate, x_max_of_pattern);
        y = this.get_bottom(Number(cell.split(" ")[1]), y_translate, y_max_of_pattern);
      }
      else if(pos == "bl"){
        x = this.get_left(Number(cell.split(" ")[0]), x_translate, x_min_of_pattern);
        y = this.get_bottom(Number(cell.split(" ")[1]), y_translate, y_max_of_pattern);
      }
      else if(pos == "cm"){
        x=this.get_middle(Number(cell.split(" ")[0]), x_median, Math.floor(this.screen_width/2), x_translate);
        y=this.get_middle(Number(cell.split(" ")[1]), y_median, Math.floor(this.screen_height/2), y_translate);
      }
      pattern_to_start.push(x+" "+y);
    });
    return pattern_to_start;
  }

  draw_pattern(response) {
    let patterns = response.split("\n");

    for(let i=0; i<patterns.length; ++i){
      if(patterns[i].length == 0){break;}

      let pattern = patterns[i].split(",");
      let first_element = pattern.shift();
      let x_translate = Number(first_element.split(":")[1].split(" ")[0]);
      let y_translate = Number(first_element.split(":")[1].split(" ")[1]);
      let pos = first_element.split(":")[1].split(" ")[2];

      pattern = this.position_elements(pattern, x_translate, y_translate, pos);
      pattern.forEach(coor =>{this.set_cell_alive(document.getElementById(coor))});
    }
  }

  draw_grid(){
    var grid_columns = "";
    for (let i=0; i<this.screen_width; ++i){grid_columns += this.div_dim+" ";}
    var grid_rows = "";
    for (let i=0; i<this.screen_height; ++i){grid_rows += this.div_dim+" ";}
    this.game_board.style.display = "grid";
    this.game_board.style.gridTemplateColumns = grid_columns;
    this.game_board.style.gridTemplateRows = grid_rows;
  }

  create_new_board(alive_cells_on_old_board){
    document.getElementById("game_display").remove();
    let new_game = document.createElement("div");
    new_game.setAttribute("id", "game_display");
    document.getElementById("game_display_div").appendChild(new_game);
    this.game_board = new_game;
    this.initialize(false, alive_cells_on_old_board);
  }

  add_cells_on_resize(){
    pause_game();
    if((this.screen_height+this.screen_width) > 250){return;}

    let tmp_div_dim=Number(this.div_dim.substring(0,this.div_dim.length-2));
    let new_height=Math.floor((window.innerHeight-(document.getElementById("header").clientHeight+document.getElementById("game_controls").clientHeight))/tmp_div_dim);
    let new_width=Math.floor(window.innerWidth/tmp_div_dim);
    let alive_cells_on_old_board = this.get_all_alive_cells(false);

    if(this.screen_height > 125 &&(this.screen_height+this.screen_width)>250){this.screen_height = 125;}
    else if(this.screen_height < 14){this.screen_height = 13;}
    else{this.screen_height = new_height;}
    if(this.screen_width > 120 &&(this.screen_height+this.screen_width)>250){this.screen_width = 125;}
    else if(this.screen_width < 14){this.screen_width = 13;}
    else{this.screen_width = new_width;}

    this.create_new_board(alive_cells_on_old_board);
    start_game();
  }

  reset(){
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let cell = document.getElementById(x+" "+y);
        if(cell.getAttribute(this.div_attribute) == 1){this.kill_cell(cell);}
      }
    }
  }

  kill_cell(cell){
    if(cell==null){return;}
    cell.style.backgroundColor = sessionStorage["current_mode"];
    cell.setAttribute(this.div_attribute, 0);
  }

  set_cell_alive(cell){
    if(cell ==null){return;}
    if(sessionStorage["current_mode"] == "white"){cell.style.backgroundColor = "black";}
    else{cell.style.backgroundColor = "white";}
    cell.setAttribute(this.div_attribute, 1);
  }

  get_all_alive_cells(data_to_post){
    let alive_cells = [];
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let cell = document.getElementById(x+" "+y);
        if(cell.getAttribute(this.div_attribute) == 1){
          alive_cells.push(x+" "+y);
        }
      }
    }
    if(data_to_post){post_data(alive_cells);}
    else{return alive_cells;}
  }

  change_color_of_cells(live_cell_color, dead_cell_color){
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let cell = document.getElementById(x+" "+y);
        if(cell.getAttribute(this.div_attribute) == 1){
          cell.style.backgroundColor = live_cell_color;
        }
        else{
          cell.style.backgroundColor = dead_cell_color;
        }
      }
    }
  }
}

class GameLogic{
  constructor(game_board){
    this.board = new GameBoard();;
    this.intreval_id;
  }
  game_logic(){
    let kill = [];
    let set_alive = [];
    let alive_cell = false;
    for(let y=0; y<this.board.screen_height; y++){
      for(let x=0; x<this.board.screen_width; x++){
        let cell = document.getElementById(x+" "+y);
        let neighbors = this.get_neighbors(x, y);
        let value_neighbors = this.value_of_neighbors(neighbors);
        let num_of_alive_neighbor = this.get_number_of_alive(value_neighbors);

        if(cell.getAttribute(this.board.div_attribute) == 1){ //is alive. Kill?
          alive_cell = true;
          if (num_of_alive_neighbor <= 1 || num_of_alive_neighbor >= 4){kill.push(cell);}
        }
        else{ //is dead. Make alive?
          if(num_of_alive_neighbor == 3){set_alive.push(cell);}
        }
      }
    }
    if (!alive_cell){stop_game();}
    this.implement_changes(kill, set_alive);
  }

  implement_changes(cell_to_kill, cell_to_set_alive){
    cell_to_kill.forEach(cell => {this.board.kill_cell(cell);});
    cell_to_set_alive.forEach(cell => {this.board.set_cell_alive(cell)});
  }
  get_number_of_alive(neigh){
    let life_counter = 0;
    neigh.forEach(elem => {
      if(elem == 1){life_counter++;}
    });
    return life_counter;
  }

  get_neighbor_cor(seed_val, max_val){
    if (seed_val == 0){return [seed_val + 1, max_val];}
    else if(seed_val == max_val){return [0, seed_val - 1]}
    else{return [seed_val + 1, seed_val - 1];}
  }

  get_neighbors(x, y){
    x = Number(x);
    y = Number(y);

    let coor_of_neigh = this.get_neighbor_cor(x, this.board.screen_width-1);
    let x_plus = coor_of_neigh[0];
    let x_minus = coor_of_neigh[1];

    coor_of_neigh = this.get_neighbor_cor(y, this.board.screen_height-1);
    let y_plus = coor_of_neigh[0];
    let y_minus = coor_of_neigh[1];

    return [x+" "+y_minus, x_plus+" "+y_minus, x_plus+" "+y, x_plus+" "+y_plus, x+" "+y_plus, x_minus+" "+y_plus, x_minus+" "+y, x_minus+" "+y_minus];
  }

  value_of_neighbors(id_of_neighbors){
    let values = [];
    for(let i=0; i < id_of_neighbors.length; ++i){
      let neighbor_cell = document.getElementById(id_of_neighbors[i]);
      let neigh_val = neighbor_cell.getAttribute(this.board.div_attribute);
      values.push(neigh_val);
    }
    return values;
  }
}

function get_data(board){
  var response_data;
  var xhr = new XMLHttpRequest();
  let file_name;
  if(window.matchMedia("(max-width: 290px)").matches){ // && window.matchMedia("(max-height: 760px)").matches
    file_name="no_walker_pattern.txt";
  }
  else if(window.matchMedia("(max-width: 500px)").matches && window.matchMedia("(max-height: 500px)").matches){
    file_name="no_mid_pattern.txt";
  }
  else{
    file_name="full_pattern.txt";
  }
  xhr.open("GET", "script/gol_patterns/"+file_name, true);
  xhr.setRequestHeader("Accept", "application/text");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status == 200) {
      board.draw_pattern(xhr.responseText);
    }
  };
  xhr.send();
}

function post_data(coor_to_store){
  let xhr = new XMLHttpRequest();
  let method = 'POST';
  xhr.open(method, "backend.php", true);
  xhr.setRequestHeader("Accept", "application/text");
  xhr.setRequestHeader("Content-Type", "application/text");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4){
      // Run sudo chmod -R 777 my_web when permission is denied
      // console.log(xhr.responseText);
    }
  };
  xhr.send(coor_to_store);
}

var game_of_life = new GameLogic();

var mouse_down = false;
var drag_to_draw = true;
var intreval_time = document.getElementById("intreval_time").value;
document.getElementById("show_intreval_time").textContent = ((document.getElementById("intreval_time").value)/1000)+" sec";

function start_game(){
  if(!game_of_life.intreval_id){
    change_opacity("0.5", "1", "1");
    game_of_life.intreval_id = setInterval(()=>{game_of_life.game_logic();}, intreval_time);
  }
}

function pause_game(){
  change_opacity("1", "0.5", "1");
  if(game_of_life.intreval_id){
    clearInterval(game_of_life.intreval_id);
  }
  game_of_life.intreval_id = null;
}

function stop_game(){
  pause_game();
  change_opacity("1", "0.5", "0.5");
  game_of_life.board.reset();
}

function take_screen_shot(){game_of_life.board.get_all_alive_cells(true);}

function change_opacity(o_start, o_pause, o_stop){
  document.getElementById("start_game").style.opacity = o_start;
  document.getElementById("pause_game").style.opacity = o_pause;
  document.getElementById("stop_game").style.opacity = o_stop;
}

function change_background_mouse_down(selected_div){
  if (mouse_down){
    if(drag_to_draw){game_of_life.board.set_cell_alive(selected_div);}
    else{game_of_life.board.kill_cell(selected_div);}
  }
}

function change_background(selected_div){
  if (selected_div.getAttribute("data-is_alive") == 1){game_of_life.board.kill_cell(selected_div);}
  else{game_of_life.board.set_cell_alive(selected_div);}
}

function move_to_change(is_draw){
  if(is_draw){
    document.getElementById("draw_cells").style.opacity = "0.5";
    document.getElementById("erase_cells").style.opacity = "1";
  }
  else{
    document.getElementById("draw_cells").style.opacity = "1";
    document.getElementById("erase_cells").style.opacity = "0.5";
  }
  drag_to_draw = is_draw;
}

document.getElementById("game_display").onmousedown = ()=>{mouse_down = true;};
document.getElementById("game_display").onmouseup = ()=>{mouse_down = false;}

document.getElementById("intreval_time").onmouseup = ()=>{change_display_of_range();};
document.getElementById("intreval_time").ontouchend = ()=>{change_display_of_range();};

function change_display_of_range(){
  pause_game();
  intreval_time = document.getElementById("intreval_time").value;
  start_game();
  document.getElementById("show_intreval_time").textContent = ((document.getElementById("intreval_time").value)/1000)+" sec";
}

function start_game_after_load() {setTimeout(() => {start_game()}, 1000);}

function show_game_explanation(){
  pause_game();
  let explanation_div = document.getElementById("explanation_wrapper");
  explanation_div.style.display="flex";
  explanation_div.setAttribute("data-is_open", 1);
}
function hide_game_explanation(){
  start_game();
  let explanation_div = document.getElementById("explanation_wrapper");
  explanation_div.style.display="none";
  explanation_div.setAttribute("data-is_open", 0);
}

function open_up_gol_info(){
  show_game_explanation();
  window.location.href="index.html#game_of_life";
}

function register_move(e){
  let cell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
  if(cell != null && cell.parentElement.id == "game_display"){
    if(drag_to_draw){game_of_life.board.set_cell_alive(cell);}
    else{game_of_life.board.kill_cell(cell);}
  }
}

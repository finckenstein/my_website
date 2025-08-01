const PATTERN_DATA = Object.freeze({
  no_walker_pattern: `
    translation:6 6 tl,24 9,22 10,23 10,25 10,26 10,22 11,26 11,22 12,23 12,25 12,26 12,24 13
    translation:3 3 br,31 11,32 11,28 12,27 13,29 13,32 13,33 13,25 14,27 14,29 14,30 14,31 14,34 14,25 15,28 15,29 15,30 15,31 15,32 15,33 15,28 16,29 16,31 16,32 16,27 17,28 17,29 17,30 17,31 17,32 17,35 17,26 18,29 18,30 18,31 18,33 18,35 18,27 19,28 19,31 19,33 19,32 20,28 21,29 21
    translation:0 1 cm,21 46,19 47,20 47,22 47,23 47,19 48,20 48,22 48,23 48
  `.trim(),

  no_mid_pattern: `
    translation:6 6 tl,24 9,22 10,23 10,25 10,26 10,22 11,26 11,22 12,23 12,25 12,26 12,24 13
    translation:2 2 tr,31 8,30 9,30 10,31 10,32 10
    translation:3 3 br,31 11,32 11,28 12,27 13,29 13,32 13,33 13,25 14,27 14,29 14,30 14,31 14,34 14,25 15,28 15,29 15,30 15,31 15,32 15,33 15,28 16,29 16,31 16,32 16,27 17,28 17,29 17,30 17,31 17,32 17,35 17,26 18,29 18,30 18,31 18,33 18,35 18,27 19,28 19,31 19,33 19,32 20,28 21,29 21
    translation:2 2 bl,11 20,12 20,13 20,13 21,12 22
  `.trim(),

  full_pattern: `
    translation:6 6 tl,24 9,22 10,23 10,25 10,26 10,22 11,26 11,22 12,23 12,25 12,26 12,24 13
    translation:2 3 tr,31 8,30 9,30 10,31 10,32 10
    translation:3 4 br,31 11,32 11,28 12,27 13,29 13,32 13,33 13,25 14,27 14,29 14,30 14,31 14,34 14,25 15,28 15,29 15,30 15,31 15,32 15,33 15,28 16,29 16,31 16,32 16,27 17,28 17,29 17,30 17,31 17,32 17,35 17,26 18,29 18,30 18,31 18,33 18,35 18,27 19,28 19,31 19,33 19,32 20,28 21,29 21
    translation:3 3 bl,11 20,12 20,13 20,13 21,12 22
    translation:0 1 cm,21 46,19 47,20 47,22 47,23 47,19 48,20 48,22 48,23 48
  `.trim()
});

class GameBoard{
  constructor(){
    let tmp_dim = this.get_div_dim();
    this.game_board = document.getElementById("game_display");

    this.screen_height = Math.floor((window.innerHeight-(document.getElementById("header").clientHeight+document.getElementById("game_controls").clientHeight))/tmp_dim);
    this.screen_width =  Math.floor(window.innerWidth/tmp_dim);
    if(this.screen_height > 125 &&(this.screen_height+this.screen_width)>250){this.screen_height = 125;}
    if(this.screen_width > 120 &&(this.screen_height+this.screen_width)>250){this.screen_width = 125;}
    if(this.screen_height < 14){this.screen_height = 13;}
    if(this.screen_width < 14){this.screen_width = 13;}

    this.mouse_down = false;
    this.drag_to_draw = true;
    this.div_dim = tmp_dim+"px";
    this.div_attribute = "data-is_alive";
    
    this.#initialize(true, null);
  }
  #initialize(draw_starting_pattern, alive_cells){
    this.#divs_to_game_board(draw_starting_pattern, alive_cells);
    this.#draw_grid();
    if(window.matchMedia("(any-hover: none)").matches){
      this.#set_event_handlers_to_board();
    }
  }

  #set_event_handlers_to_board(){
    this.game_board.addEventListener("wheel", function(e){
      e.preventDefault();
      e.stopPropagation();
    });
  }

  #divs_to_game_board(draw_starting_pattern, alive_cells){
    this.div_dim = this.get_div_dim()+"px";
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let cell_div = document.createElement("div");

        cell_div.style.border = "solid thin grey";
        cell_div.style.width = this.div_dim;
        cell_div.style.height = this.div_dim;
        cell_div.setAttribute("id", x+" "+y);

        cell_div.addEventListener("mousemove", () => this.change_background_mouse_down(cell_div));
        cell_div.addEventListener("click", () => this.change_background(cell_div));

        if(alive_cells != null && (alive_cells.includes(x+" "+y))){this.set_cell_alive(cell_div);}
        else{this.kill_cell(cell_div);}
        this.game_board.appendChild(cell_div);
      }
    }
    if(draw_starting_pattern){this.get_data();}
  }
  change_background(selected_div){
    if (selected_div.getAttribute("data-is_alive") == 1){this.kill_cell(selected_div);}
    else{
      this.set_cell_alive(selected_div);
      document.getElementById("stop_game").style.opacity = "1";
    }
  }
  change_background_mouse_down(selected_div){
    if (this.mouse_down){
      if(this.drag_to_draw){
        this.set_cell_alive(selected_div);
        document.getElementById("stop_game").style.opacity = "1";
      }
      else{this.kill_cell(selected_div);}
    }
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

      pattern = this.#position_elements(pattern, x_translate, y_translate, pos);
      pattern.forEach(coor =>{this.set_cell_alive(document.getElementById(coor))});
    }
  }
  get_data(){
    let patternKey;
    if(window.matchMedia("(max-width: 290px)").matches){ // && window.matchMedia("(max-height: 760px)").matches
      patternKey="no_walker_pattern";
    }
    else if(window.matchMedia("(max-width: 500px)").matches && window.matchMedia("(max-height: 900px)").matches){
      patternKey="no_mid_pattern";
    }
    else{
      patternKey="full_pattern";
    }
    this.draw_pattern(PATTERN_DATA[patternKey]);
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
  #position_elements(pattern, x_translate, y_translate, pos){
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
      if(pos == "tl"){ // Top Left
        x = this.get_left(Number(cell.split(" ")[0]), x_translate, x_min_of_pattern);
        y = this.get_top(Number(cell.split(" ")[1]), y_translate, y_min_of_pattern);
      }
      else if(pos == "tr"){ // Top Right
        x = this.get_right(Number(cell.split(" ")[0]), x_translate, x_max_of_pattern);
        y = this.get_top(Number(cell.split(" ")[1]), y_translate, y_min_of_pattern);
      }
      else if(pos == "br"){ // Bottom Right
        x = this.get_right(Number(cell.split(" ")[0]), x_translate, x_max_of_pattern);
        y = this.get_bottom(Number(cell.split(" ")[1]), y_translate, y_max_of_pattern);
      }
      else if(pos == "bl"){ // Bottom Left
        x = this.get_left(Number(cell.split(" ")[0]), x_translate, x_min_of_pattern);
        y = this.get_bottom(Number(cell.split(" ")[1]), y_translate, y_max_of_pattern);
      }
      else if(pos == "cm"){   // Center Middle
        x=this.get_middle(Number(cell.split(" ")[0]), x_median, Math.floor(this.screen_width/2), x_translate);
        y=this.get_middle(Number(cell.split(" ")[1]), y_median, Math.floor(this.screen_height/2), y_translate);
      }
      pattern_to_start.push(x+" "+y);
    });
    return pattern_to_start;
  }

  #draw_grid(){
    var grid_columns = "";
    for (let i=0; i<this.screen_width; ++i){grid_columns += this.div_dim+" ";}
    var grid_rows = "";
    for (let i=0; i<this.screen_height; ++i){grid_rows += this.div_dim+" ";}
    this.game_board.style.display = "grid";
    this.game_board.style.gridTemplateColumns = grid_columns;
    this.game_board.style.gridTemplateRows = grid_rows;
  }

  #create_new_board(alive_cells_on_old_board){
    document.getElementById("game_display").remove();
    let new_game = document.createElement("div");
    new_game.setAttribute("id", "game_display");
    new_game.addEventListener("touchmove", (e) => this.register_move(e));
    document.getElementById("game_display_div").appendChild(new_game);
    this.game_board = new_game;
    this.#initialize(false, alive_cells_on_old_board);
  }

  add_cells_on_resize(){
    let tmp_id=document.gol_game_ui.intreval_id;
    document.gol_game_ui.pause_game();
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

    this.#create_new_board(alive_cells_on_old_board);
    if(tmp_id){document.gol_game_ui.start_game();}
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
  set_mouse_down(mouse_down){
    this.mouse_down = mouse_down;
  }
  get_div_dim(){
    if(window.matchMedia("(max-width: 550px)").matches){return 14;}
    else if(window.matchMedia("(max-width: 1050px) and (min-width: 551px)").matches){return 14.5;}
    else if(window.matchMedia("(max-width: 1700px) and (min-width: 1051px)").matches){return 15.5;}
    else{return 20;}
  }
  get_drag_to_draw(){
    return this.drag_to_draw;
  }
  set_drag_to_draw(is_draw){
    this.drag_to_draw = is_draw;
  }
  register_move(e){
    let cell = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    if(cell != null && (cell.parentElement.id == "game_display" || cell.parentElement.id == "game_display_div")){
      e.preventDefault();
      e.stopPropagation();
      if(this.drag_to_draw){
        this.set_cell_alive(cell);
        document.getElementById("stop_game").style.opacity = "1";
      }
      else{this.kill_cell(cell);}
    }
  }
}
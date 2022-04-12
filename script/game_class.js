class GameBoard{
  constructor(){
    let tmp_dim = 20;
    this.game_board = document.getElementById("game");
    this.screen_height = Math.floor((window.innerHeight / tmp_dim) - ((window.innerHeight / tmp_dim)*0.1));
    this.screen_width =  Math.floor(window.innerWidth / tmp_dim);
    this.border = "solid thin black";
    this.div_dim = tmp_dim+"px";
    this.div_attribute = "data-is_alive";
    this.initialize();
  }

  initialize(){
    this.append_divs_to_game_board();
    this.draw_grid();
  }

  append_divs_to_game_board(){
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let tmp_div = document.createElement("div");

        tmp_div.style.border = "solid thin grey";
        //stmp_div.style.borderTop = "solid thin grey";
        tmp_div.style.width = this.div_dim;

        tmp_div.setAttribute("id", x+" "+y);
        tmp_div.setAttribute("onclick", "change_background(this)");
        tmp_div.setAttribute("onmousemove", "change_background_mouse_down(this)");
        tmp_div.setAttribute(this.div_attribute, 0);
        this.game_board.appendChild(tmp_div);
      }
    }
  }

  draw_grid(){
    var grid_columns = "";
    for (let i=0; i<this.screen_width; ++i){
      grid_columns += this.div_dim+" ";
    }

    var grid_rows = "";
    for (let i=0; i<this.screen_height; ++i){
      grid_rows += this.div_dim+" ";
    }

    this.game_board.style.display = "grid";
    this.game_board.style.gridTemplateColumns = grid_columns;
    this.game_board.style.gridTemplateRows = grid_rows;
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
    cell.style.backgroundColor = "white";
    cell.setAttribute(this.div_attribute, 0);
  }

  set_cell_alive(cell){
    cell.style.backgroundColor = "black";
    cell.setAttribute(this.div_attribute, 1);
  }

  get_all_alive_cells(){
    for (let y=0; y<this.screen_height; y++){
      for (let x=0; x<this.screen_width; x++){
        let cell = document.getElementById(x+" "+y);
        if(cell.getAttribute(this.div_attribute) == 1){console.log(x+" "+y)}
      }
    }
  }
}

class GameLogic{
  constructor(game_board){
    this.board = game_board;
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
        // value_neighbors.forEach(element => {console.log(element, typeof(element));});
        let num_of_alive_neighbor = this.get_number_of_alive(value_neighbors);
        //console.log("num_of_alive_neighbor: ", num_of_alive_neighbor);

        if(cell.getAttribute(this.board.div_attribute) == 1){ //is alive. Kill?
          alive_cell = true;
          if (num_of_alive_neighbor <= 1 || num_of_alive_neighbor >= 4){ kill.push(cell);}
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
    for(let i=0; i<cell_to_kill.length; i++){this.board.kill_cell(cell_to_kill[i]);}
    for(let i=0; i<cell_to_set_alive.length; i++){this.board.set_cell_alive(cell_to_set_alive[i]);}
  }
  get_number_of_alive(neigh){
    let life_counter = 0;
    for (let i=0; i < neigh.length; ++i){
      if (neigh[i] == 1){life_counter++;}
    }
    return life_counter;
  }

  get_neighbors(x, y){
    let neigh;
    x = Number(x);
    y = Number(y);

    let x_plus = x + 1;
    let x_minus = x - 1;
    let y_plus = y + 1;
    let y_minus = y - 1;

    //top left corner
    if (x == 0 && y == 0){neigh = [x_plus+" "+y, x_plus+" "+y_plus, x+" "+y_plus];}
    //bottom left corner
    else if(x == 0 && y == this.board.screen_height-1){neigh = [x+" "+y_minus, x_plus+" "+y_minus, x_plus+" "+y];}
    //top right corner
    else if(x == this.board.screen_width-1 && y == 0){neigh = [x+" "+y_plus, x_minus+" "+y_plus, x_minus+" "+y];}
    //bottom right corner
    else if(x == this.board.screen_width-1 && y == this.board.screen_height-1){neigh = [x_minus+" "+y, x_minus+" "+y_minus, x+" "+y_minus];}
    //left edge
    else if(x == 0){neigh = [x+" "+y_minus, x_plus+" "+y_minus, x_plus+" "+y, x_plus+" "+y_plus, x+" "+y_plus];}
    //right edge
    else if(x == this.board.screen_width-1){neigh = [x+" "+y_plus, x_minus+" "+y_plus, x_minus+" "+y, x_minus+" "+y_minus, x+" "+y_minus];}
    //top edge
    else if(y == 0){neigh = [x_plus+" "+y, x_plus+" "+y_plus, x+" "+y_plus, x_minus+" "+y_plus, x_minus+" "+y_plus];}
    //bottom edge
    else if(y == this.board.screen_height-1){neigh = [x_minus+" "+y, x_minus+" "+y_minus, x+" "+y_minus, x_plus+" "+y_minus, x_plus+" "+y];}
    //in the middle of grid
    else{
      neigh=[x+" "+y_minus, x_plus+" "+y_minus, x_plus+" "+y, x_plus+" "+y_plus, x+" "+y_plus, x_minus+" "+y_plus, x_minus+" "+y, x_minus+" "+y_minus];}
    return neigh;
  }

  value_of_neighbors(id_of_neighbors){
    let values = [];
    //console.log(id_of_neighbors);
    for(let i=0; i < id_of_neighbors.length; ++i){
      let neighbor_cell = document.getElementById(id_of_neighbors[i]);
      let neigh_val = neighbor_cell.getAttribute(this.board.div_attribute);
      values.push(neigh_val);
    }
    return values;
  }
}

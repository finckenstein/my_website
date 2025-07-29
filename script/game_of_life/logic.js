class GameLogic{

  game_logic(board){
    let kill = [];
    let set_alive = [];
    let alive_cell = false;
    for(let y=0; y<board.screen_height; y++){
      for(let x=0; x<board.screen_width; x++){
        let cell = document.getElementById(x+" "+y);
        let neighbors = this.#get_neighbors(x, y, board);
        let value_neighbors = this.#value_of_neighbors(neighbors, board);
        let num_of_alive_neighbor = this.#get_number_of_alive(value_neighbors);

        if(cell.getAttribute(board.div_attribute) == 1){ //is alive. Kill?
          alive_cell = true;
          if (num_of_alive_neighbor <= 1 || num_of_alive_neighbor >= 4){kill.push(cell);}
        }
        else{ //is dead. Make alive?
          if(num_of_alive_neighbor == 3){set_alive.push(cell);}
        }
      }
    }

    kill.forEach(cell => {board.kill_cell(cell);});
    set_alive.forEach(cell => {board.set_cell_alive(cell)});

    return !alive_cell
    
  }

  #get_number_of_alive(neigh){
    let life_counter = 0;
    neigh.forEach(elem => {
      if(elem == 1){life_counter++;}
    });
    return life_counter;
  }

  #get_neighbor_cor(seed_val, max_val){
    if (seed_val == 0){return [seed_val + 1, max_val];}
    else if(seed_val == max_val){return [0, seed_val - 1]}
    else{return [seed_val + 1, seed_val - 1];}
  }

  #get_neighbors(x, y, board){
    x = Number(x);
    y = Number(y);

    let coor_of_neigh = this.#get_neighbor_cor(x, board.screen_width-1);
    let x_plus = coor_of_neigh[0];
    let x_minus = coor_of_neigh[1];

    coor_of_neigh = this.#get_neighbor_cor(y, board.screen_height-1);
    let y_plus = coor_of_neigh[0];
    let y_minus = coor_of_neigh[1];

    return [x+" "+y_minus, x_plus+" "+y_minus, x_plus+" "+y, x_plus+" "+y_plus, x+" "+y_plus, x_minus+" "+y_plus, x_minus+" "+y, x_minus+" "+y_minus];
  }

  #value_of_neighbors(id_of_neighbors, board){
    let values = [];
    for(let i=0; i < id_of_neighbors.length; ++i){
      let neighbor_cell = document.getElementById(id_of_neighbors[i]);
      let neigh_val = neighbor_cell.getAttribute(board.div_attribute);
      values.push(neigh_val);
    }
    return values;
  }
}

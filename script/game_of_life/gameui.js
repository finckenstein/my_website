class GameUI{
  #intreval_id;
  constructor(){
    this.board = new GameBoard();
    this.game_logic = new GameLogic();
    this.intreval_time = document.getElementById("intreval_time").value;;
    this.#intreval_id=null;
  }
  
  start_game(){
    if(!this.#intreval_id){
      this.#change_opacity("0.5", "1", "1");
      this.#intreval_id = setInterval(()=>{this.game_logic.game_logic(this.board);}, this.intreval_time);
    }
  }
  #change_opacity(o_start, o_pause, o_stop){
    document.getElementById("start_game").style.opacity = o_start;
    document.getElementById("pause_game").style.opacity = o_pause;
    document.getElementById("stop_game").style.opacity = o_stop;
  }

  show_game_explanation(){
    this.pause_game();
    let explanation_div = document.getElementById("explanation_wrapper");
    explanation_div.style.display="flex";
    explanation_div.setAttribute("data-is_open", 1);
  }

  hide_game_explanation(){
    this.start_game();
    let explanation_div = document.getElementById("explanation_wrapper");
    explanation_div.style.display="none";
    explanation_div.setAttribute("data-is_open", 0);
  }
  open_up_gol_info(){
    this.show_game_explanation();
    window.location.href="index.html#game_of_life";
  }

  register_move(e){
    return this.board.register_move(e);
  }

  change_display_of_range(){
    debugger;
    this.pause_game();
    this.intreval_time = document.getElementById("intreval_time").value;
    this.start_game();
    document.getElementById("show_intreval_time").textContent = ((document.getElementById("intreval_time").value)/1000)+" sec";
  }

  move_to_change(is_draw){
    if(is_draw){
      document.getElementById("draw_cells").style.opacity = "0.5";
      document.getElementById("erase_cells").style.opacity = "1";
    }
    else{
      document.getElementById("draw_cells").style.opacity = "1";
      document.getElementById("erase_cells").style.opacity = "0.5";
    }
    this.board.set_drag_to_draw(is_draw);
  }

  pause_game(){
    if(this.#intreval_id){
      this.#change_opacity("1", "0.5", "1");
      clearInterval(this.#intreval_id);
    }
    this.#intreval_id = null;
  }

  stop_game(){
    this.pause_game();
    this.#change_opacity("1", "0.5", "0.5");
    this.board.reset();
  }

  start_game_after_load() {setTimeout(() => {this.start_game()}, 1000);}

  set_mouse_down(mouse_down){
    debugger;
    this.board.set_mouse_down(mouse_down);
  }

  get_mouse_down(){
    return this.board.get_mouse_down();
  }
}



if(sessionStorage["current_mode"] == null){sessionStorage["current_mode"] = "white";}
function translate_txt(){
  $('[data-localize]').localize("languages/language", {language: 'en'});
}

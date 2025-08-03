if(sessionStorage["current_mode"] == null){sessionStorage["current_mode"] = "white";}

async function add_work_experience(){
  const response = await fetch('languages/language-en.json');
  const data = await response.json();
  
  let work_experiences = {
    "self_employed_description": "work.self_employed.experiences",
    "accenture_description": "work.accenture.experiences",
    "ta_description": "work.vu_teaching_assistant.experiences",
  }
  debugger;
  for (const [elem_id, work_experience_data_path] of Object.entries(work_experiences)) {       
    let work_experience_data = work_experience_data_path.split('.').reduce((acc, part) => acc && acc[part], data);
    for (const [key, value] of Object.entries(work_experience_data)) {
      let p = document.createElement("p");
      p.setAttribute("data-localize", work_experience_data_path+"."+key+".title");
            
      let ul_elem = document.createElement("ul");
      for (const subKey of Object.keys(value.responsibiliites)) {
        let resp_li_elem = document.createElement("li");
        resp_li_elem.setAttribute("data-localize", work_experience_data_path+"."+key+".responsibiliites."+subKey);
        ul_elem.appendChild(resp_li_elem);
      }
      
      let li_elem = document.createElement("li");
      li_elem.appendChild(p);
      li_elem.appendChild(ul_elem);
      
      let elem = document.getElementById(elem_id);
      elem.appendChild(li_elem);
    }
  }
}

function translate_txt(){
  $('[data-localize]').localize("languages/language", {language: 'en'});
}

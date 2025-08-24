if(sessionStorage["current_mode"] == null){sessionStorage["current_mode"] = "white";}

function add_work_experience(data){
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
      p.style.padding = "10px 0px 5px";
      
      let ul_elem = document.createElement("ul");
      for (const subKey of Object.keys(value.responsibiliites)) {
        let resp_li_elem = document.createElement("li");
        resp_li_elem.setAttribute("data-localize", work_experience_data_path+"."+key+".responsibiliites."+subKey);
        resp_li_elem.style.padding = "2.5px 0px 2.5px";
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

function add_academic_education(data){
  let academics = {
    "vu_description": "education.academic.vu.experience",
    "markham_description": "education.academic.markham.experience",
  }
  debugger;
  for (const [elem_id, academic_data_path] of Object.entries(academics)) {    
    let academic_data = academic_data_path.split('.').reduce((acc, part) => acc && acc[part], data);
    for (const [key, value] of Object.entries(academic_data)) {
      let li_elem = document.createElement("li");
      li_elem.setAttribute("data-localize", academic_data_path+"."+key);
      let elem = document.getElementById(elem_id);
      elem.appendChild(li_elem);
    }
  }
}

function add_certified_education(data){
  let certificates = {"certifications": "education.certified.experience"}
  debugger;
  for (const [elem_id, certifications_data_path] of Object.entries(certificates)) {    
    let certificates_data = certifications_data_path.split('.').reduce((acc, part) => acc && acc[part], data);
    for (const [key, value] of Object.entries(certificates_data)) {
      let li_elem = document.createElement("li");
      li_elem.setAttribute("data-localize", certifications_data_path+"."+key);
      li_elem.style.paddingTop= "10px";
      let elem = document.getElementById(elem_id);
      elem.appendChild(li_elem);
    }
  }
}

async function add_html_txt_elements_to_sections(){
  const response = await fetch('languages/language-en.json');
  const data = await response.json();

  add_work_experience(data);
  add_academic_education(data);
  add_certified_education(data);
}

function translate_txt(){
  $('[data-localize]').localize("languages/language", {language: 'en'});
}

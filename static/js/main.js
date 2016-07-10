// import Model from 'static/js/model/model.js';

// var model = new Model();
// model.setup();
//
// console.log(model.sections[0].id);
// console.log(model.profs[4].name, ', id:', model.profs[4].id);
// console.log(model.lecturer[0].name, ', id:', model.lecturer[0].id);
// console.log(model.assistant[2].name, ', id:', model.assistant[2].id);

menu_bt_el = document.getElementById('toggle-menu');
menu_el = document.getElementById('menu');

menu_bt_el.addEventListener('click', function(){
  if (menu_el.className == 'menu') {
    menu_el.className = 'menu hidden';
  } else {
    menu_el.className = 'menu';
  }
}, false);


infos_el = document.getElementById('info');
els = document.querySelectorAll("#menu ul li");
for (el of els) {
  el.addEventListener('click', onListItemClicked, false);
}


function onListItemClicked(ev) {
  if (infos_el.className == 'info') {
    infos_el.className = 'info hidden';
  } else {
    infos_el.className = 'info';
  }
}

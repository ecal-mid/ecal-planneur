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

function registerCloseButton() {
  info_closebt_el = document.getElementById('close-infos');
  info_closebt_el.addEventListener('click', function(){
    infos_el.className = 'info hidden';
  }, false);
}

var staff_template = document.getElementById('staff-template').innerHTML;

var currName = null;

function onListItemClicked(ev) {
  var name = ev.currentTarget.innerHTML;
  if (name == currName) {
    infos_el.className = 'info hidden';
    currName = null;
    return;
  }
  currName = name;
  if (infos_el.className == 'info hidden') {
    infos_el.className = 'info';
  }
  getJSON('/api/staff/'+currName, function(data) {
    var output = ejs.render(staff_template, data);
    infos_el.innerHTML = output;
    registerCloseButton();
  });
}

function getJSON(url, handler) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      handler(data);
    } else {
      // We reached our target server, but it returned an error
    }
  };
  request.onerror = function() {
    // There was a connection error of some sort
  };
  request.send();
}

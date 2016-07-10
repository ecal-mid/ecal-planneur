var menu_bt_el = document.getElementById('toggle-menu');
var menu_el = document.getElementById('menu');

menu_bt_el.addEventListener('click', function(){
  if (menu_el.className == 'menu') {
    menu_el.className = 'menu hidden';
  } else {
    menu_el.className = 'menu';
  }
}, false);


var infos_el = document.getElementById('info');
var els = document.querySelectorAll("#menu ul li");
for (var el of els) {
  el.addEventListener('click', onListItemClicked, false);
}

function registerCloseButton() {
  var info_closebt_el = document.getElementById('close-infos');
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
    }
  };
  request.send();
}

// add activity

var els = document.querySelectorAll("main td.am, main td.pm");
for (var el of els) {
  el.addEventListener('click', onCaseClicked, false);
}
function onCaseClicked(ev) {
  var date = ev.currentTarget.attributes['data-date'];
  if (!date) {
    return;
  };
  date = date.value;
  var isPm = ev.currentTarget.className.indexOf('pm') != -1;
  console.log(date, isPm);
}

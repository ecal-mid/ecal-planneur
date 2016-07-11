var menu_bt_el = document.getElementById('toggle-menu');
var menu_el = document.getElementById('menu');

menu_bt_el.addEventListener('click', function(){
  if (menu_el.classList.contains('hidden')) {
    menu_el.classList.remove('hidden');
  } else {
    menu_el.classList.add('hidden');
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
    infos_el.classList.add('hidden');
  }, false);
}

var staff_template = document.getElementById('staff-template').innerHTML;

var currName = null;

function onListItemClicked(ev) {
  var name = ev.currentTarget.innerHTML;
  if (name == currName) {
    infos_el.classList.add('hidden');
    currName = null;
    return;
  }
  currName = name;
  if (infos_el.classList.contains('hidden')) {
    infos_el.classList.remove('hidden')
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

function onListItemDragOver(ev) {
  event.preventDefault();
  ev.currentTarget.classList.add('hover');
}

function onListItemDragLeave(ev) {
  ev.currentTarget.classList.remove('hover');
}

function onListItemDrop(ev) {
  ev.currentTarget.classList.remove('hover');
  var date = ev.currentTarget.attributes['data-date'];
  if (!date) {
    return;
  }
  date = date.value;
  var isPm = ev.currentTarget.className.indexOf('pm') != -1;
  console.log(ev);
  console.log(date, isPm);
}

var els = document.querySelectorAll("main td.am, main td.pm");
for (var el of els) {
  el.addEventListener('dragover', onListItemDragOver, false);
  el.addEventListener('dragenter', onListItemDragOver, false);
  el.addEventListener('dragleave', onListItemDragLeave, false);
  el.addEventListener('drop', onListItemDrop, false);
}

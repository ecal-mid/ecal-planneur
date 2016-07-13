/*
  activity detail on rollover
  filter for : prof / section / course
*/

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
var els = document.querySelectorAll("#content1 .staff .detail span.name"); // staff
for (var el of els) {
  el.addEventListener('click', onListItemClicked, false);
}


function registerCloseButton() {
  var info_closebt_el = document.getElementById('close-infos');
  info_closebt_el.addEventListener('click', function(){
    currName = null;
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
}

// staff panel

function updateStaffPanel(data){
  var output = ejs.render(staff_template, data);
  infos_el.innerHTML = output;
  registerCloseButton();
}

// render activities

if (!window.showActivity) {
  function showActivity(activity) {
    activity.show();
  }
}

Activities.fetch(function(activities){
  for (var act of activities) {
    showActivity(act);
  }
});

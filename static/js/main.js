'use strict';

var menu_bt_el = document.getElementById('toggle-menu');
var menu_el = document.getElementById('menu');

menu_bt_el.addEventListener('click', function(){
  menu_el.classList.toggle('folded');
}, false);

// staff controls / panel

var infos_el = document.getElementById('info');
var staff_template = document.getElementById('staff-template').innerHTML;
var currName = null;

function setupStaffControls() {
  var els = document.querySelectorAll("#content1 .staff .detail"); // staff
  for (var i=0; i<els.length; i++) {
    var el = els[i];
    el.addEventListener('click', onListItemClicked, false);
  }
}

function registerCloseButton() {
  var info_closebt_el = document.getElementById('close-infos');
  info_closebt_el.addEventListener('click', function(){
    currName = null;
    infos_el.classList.add('folded');
  }, false);
}

function onListItemClicked(ev) {
  var name = ev.currentTarget.querySelector('span.name').innerHTML;
  if (name == currName) {
    infos_el.classList.toggle('folded');
  }
  else {
    currName = name;
    infos_el.classList.remove('folded');
  }
}

function updateStaffPanel(data){
  var output = ejs.render(staff_template, data);
  infos_el.innerHTML = output;
  registerCloseButton();
  currName = data.name;
}

setupStaffControls();

// setup activity visibility

function setupStaffVisibilityControls() {
  var els = document.querySelectorAll("#content1 .vis-icon");
  for (var i=0; i<els.length; i++) {
    var el = els[i];
    el.addEventListener('click', onStaffVisIconClicked, false);
  }
}
function onStaffVisIconClicked(ev) {
  ev.stopPropagation();
  var icon = ev.currentTarget;
  icon.classList.toggle('on');
  updateActivityVisibility();
}
function updateActivityVisibility() {
  // retrieve list of requested staff visibility
  var els = document.querySelectorAll("#content1 .vis-icon");
  var visibleStaff = [];
  for (var i = 0; i < els.length; i++) {
    if (els[i].classList.contains('on')) {
      var staffName = els[i].nextSibling.innerHTML;
      visibleStaff.push(staffName);
    }
  }
  // loop through all the activities elements
  var actEls = document.querySelectorAll("main span.activity");
  for (var i=0; i<actEls.length; i++) {
    var el = actEls[i];
    el.classList.remove('hidden');
    if (visibleStaff.indexOf(el.activity.staff) == -1) {
      el.classList.add('hidden');
    }
  }
}
setupStaffVisibilityControls();

// render activities

if (!window.showActivity) {
  function showActivity(activity) {
    var el = activity.addView();
    el.activity = activity;
  }
}

Activities.fetch(function(activities){
  // show all
  for (var i=0; i<activities.length; i++) {
    var act = activities[i];
    showActivity(act);
  }
  updateActivityVisibility();
});

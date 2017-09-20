'use strict';

var menu_bt_el = document.getElementById('toggle-menu');
var menu_el = document.getElementById('menu');

menu_bt_el.addEventListener('click', function() {
  menu_el.classList.toggle('folded');
}, false);

// staff controls / panel

var infos_el = document.getElementById('info');
var staff_template = document.getElementById('staff-template').innerHTML;
var currName = null;

function setupStaffControls() {
  var els = document.querySelectorAll('#content1 .staff .detail');  // staff
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    el.addEventListener('click', onListItemClicked, false);
  }
  setupStaffRollover();
}

function setupStaffRollover() {
  var els = document.querySelectorAll('#content1 .staff li');  // staff
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    el.addEventListener('mouseover', function(ev) {
      var name = ev.currentTarget.querySelector('span.name').innerHTML;
      highlightStaffActivity(name);
    }, false);
    el.addEventListener('mouseout', function(ev) {
      resetActivityHightlight();
    }, false);
  }
}

function setupStaffPanelRollover() {
  var els =
      document.querySelectorAll('section.info ul li:not(.title):not(.total)');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    el.addEventListener('mouseover', function(ev) {
      var task = ev.currentTarget.querySelector('.label').innerHTML;
      highlightTaskActivity(task);
    }, false);
    el.addEventListener('mouseout', function(ev) {
      resetActivityHightlight();
    }, false);
  }
}

function registerCloseButton() {
  var info_closebt_el = document.getElementById('close-infos');
  info_closebt_el.addEventListener('click', function() {
    currName = null;
    infos_el.classList.add('folded');
    document.body.dataset['staffdetail'] = null;
    updateActivityVisibility();
  }, false);
}

function onListItemClicked(ev) {
  var name = ev.currentTarget.querySelector('span.name').innerHTML;
  if (name == currName) {
    infos_el.classList.toggle('folded');
  } else {
    currName = name;
    infos_el.classList.remove('folded');
  }
  if (infos_el.classList.contains('folded')) {
    document.body.dataset['staffdetail'] = null;
    updateActivityVisibility();
  }
}

function updateStaffPanel(data) {
  var output = ejs.render(staff_template, data);
  infos_el.innerHTML = output;
  registerCloseButton();
  setupStaffPanelRollover();
  currName = data.name;
  document.body.dataset['staffdetail'] = data.name;
}

setupStaffControls();

// setup activity visibility

function setupStaffVisibilityControls() {
  var els = document.querySelectorAll('#content1 .vis-icon');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    el.addEventListener('click', onStaffVisIconClicked, false);
  }
}
function onStaffVisIconClicked(ev) {
  ev.stopPropagation();
  var icon = ev.currentTarget;
  var parentType = icon.parentNode.tagName.toLowerCase();
  icon.classList.toggle('on');
  // if parent is not li, it's a group visibility
  // so we apply the same visibility to the whole group
  if (parentType != 'li') {
    // bit ugly access to next available UL (h3,text,ul)
    var nextUlEl = icon.nextSibling.nextSibling.nextSibling;
    var els = nextUlEl.querySelectorAll('.vis-icon');
    var add = icon.classList.contains('on');
    for (var i = 0; i < els.length; i++) {
      if (add) {
        els[i].classList.add('on');
      } else {
        els[i].classList.remove('on');
      }
    }
  }
  updateActivityVisibility();
}
function updateActivityVisibility() {
  // retrieve list of requested staff visibility
  var els = document.querySelectorAll('#content1 .vis-icon');
  var visibleStaff = [];
  for (var i = 0; i < els.length; i++) {
    if (els[i].classList.contains('on')) {
      var staffName = els[i].nextSibling.innerHTML;
      visibleStaff.push(staffName);
    }
  }
  // loop through all the activities elements
  var actEls = document.querySelectorAll('main span.activity');
  for (var i = 0; i < actEls.length; i++) {
    var el = actEls[i];
    el.classList.remove('hidden');
    if (visibleStaff.indexOf(el.activity.staff) == -1) {
      el.classList.add('hidden');
    }
    // also hide n_a activities of non-focused staff
    if (el.activity.task != 'n_a') {
      continue;
    }
    var currFocus = document.body.dataset['staffdetail'];
    if (!currFocus || currFocus.indexOf(el.activity.staff) == -1) {
      el.style.display = null;
    } else {
      el.style.display = 'inline-block';
    }
  }
}

function hideAllStaffVisibilityControls() {
  var els = document.querySelectorAll('#content1 .vis-icon');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    el.classList.remove('on');
  }
  updateActivityVisibility();
}
setupStaffVisibilityControls();


// activity highlight
function highlightTaskActivity(task) {
  var actEls = document.querySelectorAll('main span.activity');
  for (var i = 0; i < actEls.length; i++) {
    var el = actEls[i];
    if (el.activity.task == task) {
      el.classList.add('highlight');
    } else {
      el.classList.add('fade');
    }
  }
}
function highlightStaffActivity(staff) {
  var actEls = document.querySelectorAll('main span.activity');
  for (var i = 0; i < actEls.length; i++) {
    var el = actEls[i];
    if (el.activity.staff == staff) {
      el.classList.add('highlight');
    } else {
      el.classList.add('fade');
    }
  }
}
function resetActivityHightlight() {
  var actEls = document.querySelectorAll('main span.activity');
  for (var i = 0; i < actEls.length; i++) {
    var el = actEls[i];
    el.classList.remove('highlight');
    el.classList.remove('fade');
  }
}
// render activities

if (!window.showActivity) {
  window.showActivity = function(activity) {
    var el = activity.addView();
    el.activity = activity;
  }
}

Activities.fetch(function(activities) {
  // sort array by task name
  activities.sort(function(a, b) {
    if (a.task < b.task) return -1;
    if (a.task > b.task) return 1;
    return 0;
  });
  // show all
  for (var i = 0; i < activities.length; i++) {
    var act = activities[i];
    window.showActivity(act);
  }
  updateActivityVisibility();
});


var yearView_bt_els = document.querySelectorAll('.year-view button');
for (let bt of yearView_bt_els) {
  bt.addEventListener('click', function(e) {
    for (let bt of yearView_bt_els) {
      bt.classList.remove('radio-selected');
      document.body.classList.remove('hide-s1');
      document.body.classList.remove('hide-s2');
    }
    if (e.currentTarget.classList.contains('year-view-s1')) {
      document.body.classList.add('hide-s2');
    } else if (e.currentTarget.classList.contains('year-view-s2')) {
      document.body.classList.add('hide-s1');
    }
    e.currentTarget.classList.add('radio-selected');
  }, false);
}

// Show / Hide promotions

var promoView_bt_els = document.querySelectorAll('.promo-view button');
for (let bt of promoView_bt_els) {
  bt.addEventListener('click', function(e) {
    let name = 'hide-' + e.currentTarget.dataset['promo'];
    document.body.classList.toggle(name);
  }, false);
}

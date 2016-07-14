/*
  activity detail on rollover
  filter for : prof / section / course
*/


var infos_el = document.getElementById('info');
var els = document.querySelectorAll("#content1 .staff .detail"); // staff
for (var el of els) {
  el.addEventListener('click', onStaffClicked, false);
}

function onStaffClicked(ev) {
  var name = ev.currentTarget.querySelector('span.name').innerHTML;
  qwest.get('/api/staff/'+name)
     .then(function(xhr, response) {
        updateStaffPanel(response);
        registerDragStart();
     })
     .catch((e) => console.error(e));
}

// add activity

var dragItem;

function registerDragStart() {
  var els = document.querySelectorAll("section.info ul li.draggable");
  for (var el of els) {
    el.addEventListener('dragstart', onListItemDragStart, false);
  }
}

function onListItemDragStart(ev) {
  dragItem = ev.currentTarget;
}

function onDragOver(ev) {
  event.preventDefault();
  ev.currentTarget.classList.add('hover');
}

function onDragLeave(ev) {
  ev.currentTarget.classList.remove('hover');
}

function moveActivity(activity, el, date, isPm) {
  // remove previous one
  activity.delete((xhr, response) => {
    el.remove();
    // add new one
    addActivity({
      staff:activity.staff, task:activity.task, date:date, is_pm:isPm
    });
  });
}

function addActivity(data) {
  var activity = new Activity(data);
  activity.put((xhr, result) => {
    // update staff panel
    updateStaffPanel(result.staff);
    registerDragStart();
    // show activity
    activity.key = result.activity.key;
    showActivity(activity);
  });
}

function onDrop(ev) {
  ev.currentTarget.classList.remove('hover');
  var dataDate = ev.currentTarget.attributes['data-date'];
  if (!dataDate) {
    return;
  }
  var date = dataDate.value.replace(/-/g, ' ');
  var isPm = ev.currentTarget.className.indexOf('pm') != -1;

  if (dragItem.classList.contains('activity')) {
    moveActivity(dragItem.activity, dragItem, date, isPm);
  }
  else {
    var task = dragItem.querySelector('.label').innerHTML;
    addActivity({staff:currName, date:date, task:task, is_pm:isPm});
  }
  dragItem = null;
}

function onActivityClicked(ev) {
  var el = ev.currentTarget;
  var activity = el.activity;
  activity.delete((xhr, result) => {
    el.remove()
    updateStaffPanel(result);
    registerDragStart();
  });
}

// overwrite
function showActivity(activity) {
  var el = activity.show();
  el.addEventListener('click', this.onActivityClicked.bind(this), false);
  el.addEventListener('dragstart', onListItemDragStart, false);
  el.activity = activity;
}

var els = document.querySelectorAll("main td.am, main td.pm");
for (var el of els) {
  el.addEventListener('dragover', onDragOver, false);
  el.addEventListener('dragenter', onDragOver, false);
  el.addEventListener('dragleave', onDragLeave, false);
  el.addEventListener('drop', onDrop, false);
}

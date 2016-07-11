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
  qwest.get('/api/staff/'+currName)
     .then(function(xhr, response) {
        var output = ejs.render(staff_template, response);
        infos_el.innerHTML = output;
        registerCloseButton();
        registerDragStart();
     });
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

function onDrop(ev) {
  ev.currentTarget.classList.remove('hover');
  var date = ev.currentTarget.attributes['data-date'];
  if (!date) {
    return;
  }
  date = date.value;
  var isPm = ev.currentTarget.className.indexOf('pm') != -1;
  var taskId = dragItem.querySelector('.label').innerHTML;
  addActivity(currName, taskId, date, isPm);
  dragItem = null;
}

var els = document.querySelectorAll("main td.am, main td.pm");
for (var el of els) {
  el.addEventListener('dragover', onDragOver, false);
  el.addEventListener('dragenter', onDragOver, false);
  el.addEventListener('dragleave', onDragLeave, false);
  el.addEventListener('drop', onDrop, false);
}

function addActivity(staff, task, date, isPm) {
  qwest.post('/api/activity', {
        staff: staff,
        task: task,
        date: new Date(date).toUTCString(),
        is_pm: isPm
     })
     .then(function(xhr, response) {
       console.log('done', reponse);
     });
}

// render activities

qwest.get('/api/activity')
   .then(function(xhr, response) {
     console.log(reponse);
   });

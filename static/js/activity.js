'use strict'

// Collection

class Activities {

  static fetch(callback) {
    qwest.get('/api/activity')
       .then(function(xhr, data) {
         var result = []
         for (var act of data) {
           result.push(new Activity(act))
         }
         callback(result);
       });
  }
}

// Activity

class Activity {

  constructor(data) {
    this.key = data.key;
    this.staff = data.staff;
    this.task = data.task;
    this.date = new Date(data.date);
    this.date.setTime(this.date.getTime() - this.date.getTimezoneOffset()*60*1000 );
    this.isPm = data.is_pm;
  }

  put(callback) {
    qwest.post('/api/activity', this.json())
       .then(callback);
  }

  delete(callback) {
    qwest.get('/api/activity/delete/'+ this.key)
       .then(callback);
  }

  json(){
    return {
      key: this.key,
      staff: this.staff,
      task: this.task,
      date: this.date.toUTCString(),
      is_pm: this.isPm ? 1 : 0
    }
  }

  show() {
    var query = 'td[data-date="'+ this.getDateLabel()+'"].' + (this.isPm?'pm':'am');
    var td = document.querySelector(query);
    var initials = this.staff.split(' ').map( (x) => x[0] ).join('');
    var color = 'color-' + this.task.substr(0,3);

    var el = document.createElement('span');
    el.className = color;
    el.innerHTML = initials;
    td.appendChild(el);

    return el;
  }

  getDateLabel() {
    var day = this.date.getDate();
    var month = this.date.getMonth();
    month = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'][month];
    var year = this.date.getFullYear();
    return day + '-' + month + '-' + year;
  }
}

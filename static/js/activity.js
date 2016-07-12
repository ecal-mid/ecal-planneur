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
    this.staff = data.staff;
    this.task = data.task;
    this.date = new Date(data.date);
    this.date.setTime(this.date.getTime() - this.date.getTimezoneOffset()*60*1000 );
    this.isPm = data.is_pm;
  }

  put() {
    qwest.post('/api/activity', this.json())
       .then(function(xhr, response) {});
  }

  json(){
    return {
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
    var color = 'color' + this.task[0];
    td.innerHTML += '<span class="'+color+'">' + initials + '</span>';
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

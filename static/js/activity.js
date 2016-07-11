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
    this.date = data.date;
    this.isPm = data.is_pm;
  }

  put() {
    qwest.post('/api/activity', {
          staff: this.staff,
          task: this.task,
          date: this.date,
          is_pm: this.isPm
       })
       .then(function(xhr, response) {
         console.log('done', reponse);
       });
  }
}

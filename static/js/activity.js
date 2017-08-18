'use strict';

// Collection

class Activities {
  static fetch(callback) {
    qwest.get('/api/activity')
        .then(function(xhr, data) {
          var result = [];
          for (var act of data) {
            result.push(new Activity(act))
          }
          callback(result);
        })
        .catch(function(e) {
          console.error(e);
          callback(null);
        });
  }
}

// Activity

class Activity {
  constructor(data) {
    this.key = data.key;
    this.staff = data.staff;
    this.task = data.task;
    // discard timezone
    let dateStr = data.date.toString();
    if (dateStr.indexOf('GMT') != -1) {
      dateStr = dateStr.substr(0, dateStr.indexOf('GMT'));
    }
    this.date = new Date(dateStr);
    this.isPm = data.is_pm;
  }

  put(callback) {
    qwest.post('/api/activity', this.json()).then(callback).catch(function(e) {
      console.error(e)
    });
  }

  remove(callback) {
    qwest.get('/api/activity/delete/' + this.key)
        .then(callback)
        .catch(function(e) {
          console.error(e)
        });
  }

  json() {
    let absDate =
        this.date.toString().substr(0, this.date.toString().indexOf('GMT'));
    return {
      key: this.key, staff: this.staff, task: this.task.trim(), date: absDate,
          is_pm: this.isPm ? 1 : 0
    }
  }

  addView() {
    var query = 'td[data-date="' + this.getDateLabel() + '"].' +
        (this.isPm ? 'pm' : 'am');
    var td = document.querySelector(query);
    if (!td) {
      throw 'could not find cell for activity: ' + query;
      return null;
    }
    var initials = this.staff.split(' ')
                       .map(function(x) {
                         return x[0];
                       })
                       .join('');
    if (this.task == 'n_a') {
      initials = '';  // hide text for N/A
    } else {
      if (this.staff == 'Angelo Benedetto')
        initials = 'AN';  // hack to distinguish Angelo from Alain
      if (this.staff == 'Cedric Duchene')
        initials = 'CE';  // hack to distinguish Cedric from Cyril
    }
    var color = 'color-' + this.task.substr(0, 3);

    var el = document.createElement('span');
    el.setAttribute('draggable', true);
    el.classList.add(color);
    el.classList.add('activity');
    el.classList.add('draggable');
    el.innerHTML = initials;
    td.appendChild(el);

    return el;
  }

  getDateLabel() {
    var day = this.date.getDate();
    var month = this.date.getMonth();
    month = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ][month];
    var year = this.date.getFullYear();
    return day + '-' + month + '-' + year;
  }
}

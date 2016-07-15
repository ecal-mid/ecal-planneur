""" API """

from datetime import datetime

from flask import (
    Blueprint,
    jsonify,
    request)

from google.appengine.ext import ndb

from .models import Planning, planning, Activity

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/')
def hello():
    return 'API v1'

@bp.route('/staff/<string:name>')
def get_staff(name):
    staff = planning.get_staff_by_name(name)
    return jsonify(staff)

@bp.route('/activity')
def get_activities():
    activities = planning.get_activities()
    # return results from cache
    result = [act.get_dict() for key, act in activities.iteritems()]
    return jsonify(result)

@bp.route('/activity', methods=['POST'])
def add_activity():
    date_format = "%a, %d %b %Y %H:%M:%S %Z"
    # todo: add activity
    ancestor_key = parent=ndb.Key("Planning", Planning.config.name)
    activity = Activity(parent=ancestor_key)
    activity.staff = request.form['staff']
    activity.task = request.form['task']
    activity.date = datetime.strptime(request.form['date'], date_format)
    activity.is_pm = (int(request.form['is_pm']) == 1)
    activity.put()
    # update cache
    aid = activity.key.id()
    planning.activities[aid] = activity
    # get updated staff
    staff = planning.get_staff_by_name(activity.staff)
    return jsonify({
        'staff': staff,
        'activity': activity.get_dict()
    })

@bp.route('/activity/delete/<int:id>')
def delete_activity(id):
    ancestor_key = ndb.Key("Planning", Planning.config.name)
    activity = Activity.get_by_id(id, parent=ancestor_key)
    staff_name = activity.staff
    activity.key.delete()
    # update cache
    del planning.activities[id]
    # get updated staff
    staff = planning.get_staff_by_name(staff_name)
    return jsonify(staff)

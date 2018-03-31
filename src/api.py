""" API """

import dateutil.parser as dt

from flask import (
    Blueprint,
    jsonify,
    request)

from google.appengine.ext import ndb

from .models import Planning, planning, Activity
from .changelist import Change, add_change, current_changes

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/')
def hello():
    return 'API v1'


@bp.route('/staff/<string:name>')
def get_staff(name):
    staff = planning.get_staff_by_name(name).get_json()
    return jsonify(staff)


@bp.route('/activity')
def get_activities():
    activities = planning.get_activities()
    result = [act.get_dict() for key, act in activities.iteritems()]
    return jsonify(result)


@bp.route('/activity', methods=['POST'])
def add_activity():
    # todo: add activity
    ancestor_key = parent = ndb.Key("Planning", Planning.config.name)
    activity = Activity(parent=ancestor_key)
    activity.staff = request.form['staff']
    activity.task = request.form['task']
    activity.date = dt.parse(request.form['date'])
    activity.is_pm = (int(request.form['is_pm']) == 1)
    activity.put()
    # update cache
    # aid = activity.key.id()
    # planning.activities[aid] = activity
    planning.add_activity(activity)
    # add to changelist
    change = Change(activity, 'added')
    add_change(change)
    # get updated staff
    staff = planning.get_staff_by_name(activity.staff).get_json()
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
    planning.remove_activity(id)
    # add to changelist
    change = Change(activity, 'removed')
    add_change(change)
    # get updated staff
    staff = planning.get_staff_by_name(staff_name).get_json()
    return jsonify(staff)

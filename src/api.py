""" API """

from datetime import datetime

from flask import (
    Blueprint,
    jsonify,
    request)

from .models import Planning, Activity

planning = Planning('2016-2017')

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/')
def hello():
    return 'API v1'

@bp.route('/staff/<string:name>')
def get_staff(name):
    staff = planning.get_staff_by_name(name)
    return jsonify(staff)

@bp.route('/activity')
def get_activity():
    activities = Activity.query().fetch()
    return jsonify([a.to_dict() for a in activities])

@bp.route('/activity', methods=['POST'])
def add_activity():
    staff = request.form['staff']
    task = request.form['task']
    date = request.form['date']
    is_pm = request.form['is_pm']
    # todo: add activity
    activity = Activity()
    activity.staff_id = staff
    activity.task_id = task
    activity.date = datetime.strptime(date, "%a, %d %b %Y %H:%M:%S %Z")
    activity.is_pm = (is_pm == "false")
    activity.put()
    # get updated staff
    staff = planning.get_staff_by_name(staff)
    return jsonify(staff)

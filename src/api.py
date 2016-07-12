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
    date_format = "%a, %d %b %Y %H:%M:%S %Z"
    # todo: add activity
    activity = Activity()
    activity.staff = request.form['staff']
    activity.task = request.form['task']
    activity.date = datetime.strptime(request.form['date'], date_format)
    activity.is_pm = (int(request.form['is_pm']) == 1)
    print request.form
    activity.put()
    # get updated staff
    staff = planning.get_staff_by_name(activity.staff)
    return jsonify(staff)

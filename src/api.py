""" API """

from flask import (
    Blueprint,
    jsonify,
    request)

from .models import Planning

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/')
def hello():
    return 'API v1'

@bp.route('/staff/<string:name>')
def get_staff(name):
    planning = Planning('2016-2017')
    staff = planning.get_staff_by_name(name)
    return jsonify(staff)

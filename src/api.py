""" API """

from flask import (
    Blueprint,
    jsonify,
    request)

from .models import Planning

bp = Blueprint('api', __name__, url_prefix='/api')

@bp.route('/<int:id>')
def read(id):
    return jsonify({id:id})

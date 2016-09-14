""" CalDav Synchronization """

from flask import Blueprint

from .models import planning

bp = Blueprint('caldav', __name__, url_prefix='/caldav')

@bp.route('/')
def hello():
    return 'CalDav Synchronization'

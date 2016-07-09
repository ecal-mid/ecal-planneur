""" Index """

from flask import Blueprint, render_template

from .models import Planning

bp = Blueprint('index', __name__, static_folder='../static', template_folder='../templates')

@bp.route('/')
def index():
    """Return the homepage."""
    planning = Planning()
    return render_template('index.html', planning=planning)

@bp.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

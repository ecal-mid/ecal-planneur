""" Index """

from flask import Blueprint, render_template, jsonify

from .models import Planning

planning = Planning('2016-2017')

bp = Blueprint(
    'index', __name__,
    static_folder='../static',
    template_folder='../templates')

@bp.route('/')
def index():
    """Return the homepage."""
    return render_template('index.html', planning=planning)

@bp.route('/detail/<string:staff>')
def index_staff(staff):
    """Return the homepage with access to a staff's details."""
    staff = planning.get_staff_by_name(staff)
    print staff
    return render_template('index.html', planning=planning, detail=staff, detail_json=staff)

@bp.route('/admin')
def admin():
    """Return the admin page."""
    return render_template('index.html', planning=planning, admin=True)

@bp.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

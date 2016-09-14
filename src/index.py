""" Index """

from flask import Blueprint, render_template, jsonify
from itsdangerous import URLSafeSerializer

from .models import planning, refresh_planning

bp = Blueprint(
    'index', __name__,
    static_folder='../static',
    template_folder='../templates')

# setup serializer that can decrypt staff's tokens
secret = open('config/'+planning.config.name+'/secret.yaml')
serializer = URLSafeSerializer(secret.read())

@bp.route('/')
def index():
    """Return the homepage."""
    return render_template('index.html', planning=planning)

@bp.route('/admin')
def admin():
    """Return the admin page."""
    return render_template('index.html', planning=planning, admin=True)

@bp.route('/refresh')
def refresh():
    """Force refresh of calendar. Used to update current day in cron job."""
    refresh_planning()
    return 'OK'

@bp.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

@bp.route('/report/<string:token>')
def report_staff(token):
    """Return the homepage with access to a staff's details."""
    # for name in [x.name for x in planning.staffs]:
    #     print name, serializer.dumps(name)
    try:
        name = serializer.loads(token)
    except Exception as e:
        return str(e)
    if name in [x.name for x in planning.staffs]:
        staff = planning.get_staff_by_name(name)
        return render_template('index.html',
                                planning=planning,
                                detail=staff,
                                detail_json=staff.get_json())
    return 'staff not found'

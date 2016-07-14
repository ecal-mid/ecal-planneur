""" Index """

from flask import Blueprint, render_template, jsonify
from itsdangerous import URLSafeSerializer

from .models import planning

bp = Blueprint(
    'index', __name__,
    static_folder='../static',
    template_folder='../templates')

@bp.route('/')
def index():
    """Return the homepage."""
    return render_template('index.html', planning=planning)

@bp.route('/detail/<string:staff>')
def report_staff(staff):
    """Return the homepage with access to a staff's details."""
    staff = planning.get_staff_by_name(staff)
    return render_template('index.html', planning=planning, detail=staff, detail_json=staff)

@bp.route('/admin')
def admin():
    """Return the admin page."""
    return render_template('index.html', planning=planning, admin=True)

@bp.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

@bp.route('/report/<string:token>')
def token_access(token):
    secret = open('config/'+planning.config.name+'/secret.yaml')
    s = URLSafeSerializer(secret.read())
    try:
        name = s.loads(token)
        if name in [x.name for x in planning.staffs]:
            return report_staff(name)
    except:
        print 'token error'
    for name in [x.name for x in planning.staffs]:
        print name, s.dumps(name)
    return 'token not recognized or expired'

""" Index """

from flask import Blueprint, render_template, jsonify, redirect, url_for
from itsdangerous import URLSafeSerializer

from google.appengine.api import mail

from .models import planning
from .changelist import current_changes, get_changes_per_staff, remove_staff_changes

bp = Blueprint(
    'index', __name__,
    static_folder='../static',
    template_folder='../templates')

def get_report_token(staff_name):
    secret = open('config/'+planning.config.name+'/secret.yaml')
    s = URLSafeSerializer(secret.read())
    return s.dumps(staff_name)

@bp.route('/')
def index():
    """Return the homepage."""
    return render_template('index.html', planning=planning)

@bp.route('/detail/<string:staff>')
def report_staff(staff):
    """Return the homepage with access to a staff's details."""
    staff = planning.get_staff_by_name(staff)
    return render_template('index.html',
                            planning=planning,
                            detail=staff,
                            detail_json=staff.get_json())

@bp.route('/changelist')
def report_changelist():
    """Return the list of non-reported changes."""
    changes_per_staff = get_changes_per_staff()
    return render_template('changelist.html', changelist=changes_per_staff)

@bp.route('/report_staff_changelist/<string:staff>')
def report_staff_changelist(staff):
    """Return the list of non-reported changes of a specific staff."""
    staff = planning.get_staff_by_name(staff)
    staff_changes = [c for c in current_changes if c.activity.staff == staff.name]
    base_url = 'http://ecal-planneur.appspot.com/report/'
    url = base_url + get_report_token(staff.name)
    # render email's template
    body = render_template('email.html',
                            name=staff.name.split(" ")[0],
                            changelist=staff_changes,
                            url=url)
    # send email
    mail.send_mail(sender="ECAL M&ID Planning <do-not-reply@ecal-planneur.appspotmail.com>",
                   to=staff.email,
                   subject="New changes made to your ECAL M&ID Planning",
                   body=body,
                   html=body)
    # remove changelist report for that staff
    remove_staff_changes(staff.name)
    # redirect to list of changes
    return redirect(url_for('index.report_changelist'))

@bp.route('/silence_staff_changelist/<string:staff>')
def silence_staff_changelist(staff):
    """Ignore non-reported changes of a specific staff in next report."""
    # remove changelist report for that staff
    remove_staff_changes(staff)
    # redirect to list of changes
    return redirect(url_for('index.report_changelist'))

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

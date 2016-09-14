from datetime import datetime
from google.appengine.api import mail
from itsdangerous import URLSafeSerializer

from flask import Blueprint, render_template, redirect, url_for

from .models import planning

bp = Blueprint('changelist', __name__, url_prefix='/changelist')

@bp.route('/')
def report_changelist():
    """Return the list of non-reported changes."""
    changes_per_staff = get_changes_per_staff()
    return render_template('changelist.html', changelist=changes_per_staff)

@bp.route('/notify/<string:staff>')
def report_staff_changelist(staff):
    """Return the list of non-reported changes of a specific staff."""
    staff = planning.get_staff_by_name(staff)
    staff_changes = [c for c in current_changes if c.activity.staff == staff.name]
    base_url = 'http://ecal-planneur.appspot.com/report/'
    url = base_url + serializer.dumps(staff.name)
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
    return redirect(url_for('changelist.report_changelist'))

@bp.route('/silence/<string:staff>')
def silence_staff_changelist(staff):
    """Ignore non-reported changes of a specific staff in next report."""
    # remove changelist report for that staff
    remove_staff_changes(staff)
    # redirect to list of changes
    return redirect(url_for('changelist.report_changelist'))


# utils

# setup serializer that can decrypt staff's tokens
secret = open('config/'+planning.config.name+'/secret.yaml')
serializer = URLSafeSerializer(secret.read())

# holds current list of changes
current_changes = []

class Change:
    def __init__(self, activity, kind):
        self.activity = activity
        self.kind = kind
        self.date_changed = datetime.now()

def add_change(change):
    current_changes.append(change)

def get_changes_per_staff():
    changes_per_staff = []
    for staff in planning.staffs:
        changes = {}
        changes['changes'] = [c for c in current_changes if c.activity.staff == staff.name]
        if len(changes['changes']) < 1:
            continue
        changes['staff_name'] = staff.name
        changes_per_staff.append(changes)
    return changes_per_staff

def remove_staff_changes(staff):
    global current_changes
    current_changes = [c for c in current_changes if staff != c.activity.staff]

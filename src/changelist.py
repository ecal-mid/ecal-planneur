from datetime import datetime
from .models import planning

class Change:
    def __init__(self, activity, kind):
        self.activity = activity
        self.kind = kind
        self.date_changed = datetime.now()

current_changes = []

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

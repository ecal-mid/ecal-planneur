""" ical export """

from flask import Blueprint, request
from datetime import date, datetime, timedelta
from icalendar import Calendar, Event
import pytz
from .models import planning

bp = Blueprint('ical', __name__, url_prefix='/ical')

@bp.route('/')
def hello():
    return 'iCal export'

@bp.route('/<staff_name>')
def staff(staff_name):
    activities = planning.get_staff_activities(staff_name)
    if len(activities) is 0:
        return 'No activity found for {} (mispelling?).'.format(staff_name)
    cal = Calendar()
    cal.add('prodid', '-//Ecal - {}//mxm.dk//'.format(staff_name))
    cal.add('version', '2.0')
    timezone = pytz.timezone('Europe/Paris')
    act_filter = request.args.get('filter')
    force_label = request.args.get('force_label')
    for act in activities:
        if act_filter and act_filter != act.task:
            continue
        event = Event()
        start = datetime(act.date.year, act.date.month, act.date.day).replace(tzinfo=timezone)
        if act.is_pm:
            start += timedelta(hours=13, minutes=30)
        else:
            start += timedelta(hours=8, minutes=15)
        name = 'OOO' if act.task == 'n_a' else act.task
        if force_label is not None:
            name = force_label
        event.add('summary', name)
        event.add('dtstart', start)
        event.add('dtend', start + timedelta(hours=3, minutes=30))
        event.add('dtstamp', start)
        cal.add_component(event)
    return cal.to_ical()

@bp.route('/cyril-google')
def google():
    staff_name = 'Cyril Diagne'
    activities = planning.get_staff_activities(staff_name)
    cal = Calendar()
    cal.add('prodid', '-//Ecal - {}//mxm.dk//'.format(staff_name))
    cal.add('version', '2.0')
    timezone = pytz.timezone('Europe/Paris')
    for act in activities:
        if act.task != 'n_a' or act.is_pm:
            continue
        start = date(act.date.year, act.date.month, act.date.day)
        event = Event()
        event.add('summary', 'Cyril @CI')
        event.add('dtstart', start)
        event.add('dtend', start)
        event.add('dtstamp', start)
        cal.add_component(event)
    return cal.to_ical()

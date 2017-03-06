""" CalDav Synchronization """

from flask import Blueprint

from datetime import datetime
import caldav
from caldav.elements import dav, cdav
from caldav.objects import Calendar

from .models import planning

bp = Blueprint('calsync', __name__, url_prefix='/calsync')

@bp.route('/')
def hello():
    return 'CalDav Synchronization'

@bp.route('/test')
def test():
    # Caldav url
    url = "https://p36-caldav.icloud.com:443/8398603643/"

    res = "hello"

    client = caldav.DAVClient(url=url, username="cyril.diagne@ecal.ch", password="dia206RGB24")
    c = Calendar(client=client, url='/8398603643/calendars/DB8C18C0-C3C1-4F73-83D7-F4A56DE29FAC/')
    events2 = c.events()
    # principal = client.principal()
    # calendars = principal.calendars()
    # res += '\nFound ' + str(len(calendars))
    # if len(calendars) > 0:
    #     calendar = calendars[0]
    #     res += "\nUsing calendar" + calendar
    #
    #     # res += "\nRenaming"
    #     # calendar.set_properties([dav.DisplayName("Test calendar"),])
    #     # res += calendar.get_properties([dav.DisplayName(),])
    #     #
    #     # event = calendar.add_event(vcal)
    #     # res += "\nEvent" + event + "created"
    #
    #     res += "\nLooking for events in 2010-05"
    #     results = calendar.date_search(
    #         datetime(2016, 5, 1), datetime(2016, 7, 15))
    #
    #     for event in results:
    #         res += "\nFound", event
    return res

""" Main """

from flask import Flask
from flask.ext.mobility import Mobility

from .index import bp as index
from .api import bp as api
from .ical import bp as ical
from .changelist import bp as changelist

app = Flask(__name__)
# app.config['DEBUG'] = True
Mobility(app)

app.register_blueprint(index)
app.register_blueprint(api)
app.register_blueprint(changelist)
app.register_blueprint(ical)

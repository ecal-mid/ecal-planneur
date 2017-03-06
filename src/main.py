""" Main """

from flask import Flask

from .index import bp as index
from .api import bp as api
from .calsync import bp as calsync
from .changelist import bp as changelist

app = Flask(__name__)
# app.config['DEBUG'] = True

app.register_blueprint(index)
app.register_blueprint(api)
app.register_blueprint(calsync)
app.register_blueprint(changelist)

""" Main """

from flask import Flask

from .index import bp as index
from .api import bp as api

app = Flask(__name__)
app.config['DEBUG'] = True

app.register_blueprint(index)
app.register_blueprint(api)

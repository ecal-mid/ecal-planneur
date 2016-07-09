from flask import Flask
APP = Flask(__name__, static_url_path='', static_folder='../www')
APP.config['DEBUG'] = True

@APP.route('/')
def index():
    """Return the homepage."""
    print('gotcha')
    return APP.send_static_file('index.html')

@APP.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404

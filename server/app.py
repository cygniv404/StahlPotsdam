import datetime
import os

from dotenv import load_dotenv
from flask import Flask
from helpers import JSONEncoder

load_dotenv()


def create_app():
    _flask_app = Flask(__name__)
    _flask_app.config['PROPAGATE_EXCEPTIONS'] = True
    _flask_app.config['JWT_SECRET_KEY'] = os.getenv('SECRET')
    _flask_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
    _flask_app.config['CORS_HEADERS'] = 'application/json'
    _flask_app.json_encoder = JSONEncoder
    return _flask_app

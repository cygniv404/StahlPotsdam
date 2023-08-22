import datetime
import os
from dotenv import load_dotenv
from flask import Flask, g
from flask_cors import CORS
from database import init_db
from helpers import JSONEncoder


def create_app():
    _flask_app = Flask(__name__)
    _flask_app.config['PROPAGATE_EXCEPTIONS'] = True
    _flask_app.config['JWT_SECRET_KEY'] = os.getenv('SECRET')
    _flask_app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
    _flask_app.config['CORS_HEADERS'] = 'application/json'
    _flask_app.json_encoder = JSONEncoder
    _flask_app.app_context().push()
    return app


load_dotenv()

app = create_app()
CORS(app)

with app.app_context():
    if not hasattr(g, 'mongodb'):
        g.mongodb = init_db()
    from .api.routes import *

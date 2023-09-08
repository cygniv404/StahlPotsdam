import os
import pytest
from flask import g
from flask_cors import CORS

import flask_app
from database import init_db

# Set the Testing configuration prior to creating the Flask application
os.environ['CONFIG_TYPE'] = 'config.TestingConfig'
app = flask_app.create_app()
app.app_context().push()
CORS(app)

if not hasattr(g, 'mongodb'):
    g.mongodb = init_db()

from api.routes import article, article_group, bend_type, client, cost_center, datagrid, file, incoming_invoice, \
    incoming_material, offer, offer_position, order, order_position, postition, shipping_methods, special_price, \
    supplier, system, user


@pytest.fixture(scope='module')
def test_client():
    # Create a test client using the Flask application configured for testing
    with app.test_client() as testing_client:
        # Establish an application context
        with app.app_context():
            yield testing_client  # this is where the testing happens!

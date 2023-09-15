import os
import pytest
import main

# Set the Testing configuration prior to creating the Flask application
os.environ['CONFIG_TYPE'] = 'config.TestingConfig'


@pytest.fixture(scope='module')
def test_client():
    # Create a test client using the Flask application configured for testing
    with main.app.test_client() as testing_client:
        # Establish an application context
        with main.app.app_context():
            yield testing_client  # this is where the testing happens!

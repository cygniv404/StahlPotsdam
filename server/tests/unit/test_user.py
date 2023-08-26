def test_user_register(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/register' page is requested (POST)
    THEN check that user is registered
    """
    response = test_client.post('/register', json={'name': 'ahmed', 'password': 'ahmed'})
    assert response.status_code == 200
    assert response.json['ok'] is True
    assert response.json['message'] == 'User created successfully!'


def test_user_login(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (post)
    THEN check that registered can log in
    """
    response = test_client.post('/auth', json={'name': 'ahmed', 'password': 'ahmed'})
    assert response.status_code == 200
    assert response.json['ok'] is True
    assert response.json['data']['name'] == 'ahmed'


def test_user_logged_in_status(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/AUTH' page is requested (POST)
    THEN check that user is logged in
    """
    _auth_response = test_client.post('/auth', json={'name': 'ahmed', 'password': 'ahmed'})
    access_token = _auth_response.json['data']['token']
    response = test_client.get('/status', headers={'Authorization': 'Bearer {}'.format(access_token)})
    assert response.status_code == 200
    assert response.json['ok'] is True
    assert response.json['message'] == 'User is logged in'

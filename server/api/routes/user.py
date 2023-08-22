import os
from flask import g, request, jsonify, current_app as app
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (create_access_token, create_refresh_token,
                                jwt_required, get_jwt_identity, JWTManager)
import logging

ROOT_PATH = os.environ.get('ROOT_PATH')
db = g.mongodb
flask_bcrypt = Bcrypt(app)
jwt = JWTManager(app)


@jwt.unauthorized_loader
def unauthorized_response():
    return jsonify({
        'ok': False,
        'message': 'Missing Authorization Header in API call.'
    }), 401


@app.route('/status', methods=['GET'])
@jwt_required()
def test_auth():
    logging.debug('User  is Logged In')
    return jsonify({'ok': True, 'message': 'User is logged in'}), 200


@app.route('/auth', methods=['POST'])
def auth_user():
    """ auth endpoint """
    data = request.json
    user_account = db.users.find_one({'name': data['name']}, {"_id": 0})
    logging.debug(user_account)
    if user_account and flask_bcrypt.check_password_hash(user_account['password'], data['password']):
        del user_account['password']
        access_token = create_access_token(identity=data)
        refresh_token = create_refresh_token(identity=data)
        user_account['token'] = access_token
        user_account['refresh'] = refresh_token
        return jsonify({'ok': True, 'data': user_account}), 200
    else:
        return jsonify({'ok': False, 'message': 'invalid username or password'}), 401


@app.route('/register', methods=['POST'])
def register():
    """ register user endpoint """
    data = request.json
    data['password'] = flask_bcrypt.generate_password_hash(data['password'])
    db.users.insert_one(data)
    return jsonify({'ok': True, 'message': 'User created successfully!'}), 200


@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """ refresh token endpoint """
    current_user = get_jwt_identity()
    ret = {
        'token': create_access_token(identity=current_user)
    }
    return jsonify({'ok': True, 'data': ret}), 200

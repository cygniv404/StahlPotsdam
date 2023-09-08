import json

from flask import g, current_app as app, jsonify
from flask_jwt_extended import jwt_required
from pymongo import ASCENDING

db = g.mongodb.stahlpotsdam


#  MAT #
@app.route('/bend_type/mat/<string:bend_type_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_mat_bend_type(bend_type_id):
    result = []
    bend_types = db.images_mat_coordinates.find().sort("id", ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    if bend_type_id == "-1":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if bend_type_id in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/bend_type/mat/<string:bend_type_id>/next', methods=['GET'])
@jwt_required()
def get_next_mat_bend_type(bend_type_id):
    result = []
    bend_types = db.images_mat_coordinates.find().sort("id", ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    if bend_type_id == "-1":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if item['id'] == bend_type_id), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/bend_type/mat/<string:bend_type_id>', methods=['GET'])
@jwt_required()
def get_mat_bend_type(bend_type_id):
    bend_type = db.images_mat_coordinates.find_one({"id": bend_type_id})
    return json.dumps(bend_type, default=str) if bend_type is not None else jsonify({})


@app.route('/bend_type/mat', methods=['GET'])
def get_all_mat_bend_type():
    result = []
    bend_types = db.images_mat_coordinates.find().sort('id', ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    return json.dumps(result, default=str)


# OTHERS #
@app.route('/bend_type/others/<string:bend_type_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_bend_type(bend_type_id):
    result = []
    bend_types = db.images_coordinates.find().sort("id", ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    if bend_type_id == "-1":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if bend_type_id in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/bend_type/others/<string:bend_type_id>/next', methods=['GET'])
@jwt_required()
def get_next_bend_type(bend_type_id):
    result = []
    bend_types = db.images_coordinates.find().sort("id", ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    if bend_type_id == "-1":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if item['id'] == bend_type_id), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/bend_type/others/<string:bend_type_id>', methods=['GET'])
@jwt_required()
def get_bend_type(bend_type_id):
    bend_type = db.images_coordinates.find_one({"id": bend_type_id})
    return json.dumps(bend_type, default=str) if bend_type is not None else jsonify({})


@app.route('/bend_type/others', methods=['GET'])
@jwt_required()
def get_all_bend_type():
    result = []
    bend_types = db.images_coordinates.find().sort('id', ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    return json.dumps(result, default=str)

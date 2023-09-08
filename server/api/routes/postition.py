import json

from flask import g, current_app as app
from flask_jwt_extended import jwt_required
from pymongo import ASCENDING

db = g.mongodb.stahlpotsdam


@app.route('/position/<string:position_type>/<string:position_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_position(position_type, position_id):
    result = []
    type_groups = db.position_types.find_one({}, {position_type: 1})
    articles = db.articles.find({"product_group": {"$in": type_groups[position_type]}}).sort("id", ASCENDING)
    for article in articles:
        result.append(article)
    if position_id == "0":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if position_id.replace('_', '/') in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/position/<string:position_type>/<string:position_id>/next', methods=['GET'])
@jwt_required()
def get_next_position(position_type, position_id):
    result = []
    type_groups = db.position_types.find_one({}, {position_type: 1})
    articles = db.articles.find({"product_group": {"$in": type_groups[position_type]}}).sort("id", ASCENDING)
    for article in articles:
        result.append(article)
    if position_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if position_id.replace('_', '/') in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)

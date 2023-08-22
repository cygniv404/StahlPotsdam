import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import ASCENDING

db = g.mongodb


@app.route('/order/<int:order_id>/position/<string:order_position_id>', methods=['GET'])
@jwt_required()
def get_order_position(order_id, order_position_id):
    order_position = db.order_positions.find_one({"order_id": order_id, "id": order_position_id})
    return json.dumps(order_position, default=str) if order_position is not None else jsonify({})


@app.route('/order/<int:order_id>/position', methods=['GET'])
def get_all_order_position(order_id):
    result = []
    order_positions = db.order_positions.find({"order_id": order_id})
    for pos in order_positions:
        result.append(pos)
    return json.dumps(result, default=str)


@app.route('/order/<int:order_id>/position/<string:order_position_id>', methods=['DELETE'])
def delete_order_position(order_id, order_position_id):
    deleted_order_position = db.order_positions.delete_one({"order_id": order_id, "id": order_position_id})
    return json.dumps({'deleteCount': deleted_order_position.deleted_count},
                      default=str) if deleted_order_position.deleted_count == 1 else jsonify({})


@app.route('/order/position', methods=['POST'])
@jwt_required()
def create_and_update_order_position():
    data = request.json
    found_position = db.order_positions.find_one({'id': data['positionId']})
    order_position = {
        'id': data['positionId'],
        'group': data['positionGroup'],
        'order_id': data['orderId'],
        'article_id': data['articleId'],
        'article_description': data['articleDescription'],
        'part_count': data['partCount'],
        'part_width': data['partWidth'] if 'partWidth' in data else None,
        'bend_type_id': data['bendTypeId'] if 'bendTypeId' in data else '',
        'bend_type_group': data['bendTypeGroup'] if 'bendTypeGroup' in data else None,
        'measures': data['measures'] if 'measures' in data else None,
        'overall_length': data['overallLength'] if 'overallLength' in data else 0,
    }
    if found_position is None:
        result = db.order_positions.insert_one(order_position)
        return json.dumps({'id': result.inserted_id}, default=str)
    else:
        result = db.order_positions.update_one({'id': data['positionId']}, {'$set': order_position})
        return json.dumps({'modifiedCount': result.modified_count}, default=str)


@app.route('/order/<int:source_order_id>/position/copy/<int:target_order_id>', methods=['POST'])
def copy_order_position(source_order_id, target_order_id):
    data = request.json
    positions = [pos for pos in data['positions'].keys() if data['positions'][pos]]
    new_positions = []
    found_positions = db.order_positions.find({'order_id': source_order_id, 'id': {'$in': positions}})
    for position in found_positions:
        position.pop("_id")
        position['order_id'] = target_order_id
        new_positions.append(position)
    result = db.order_positions.insert_many(new_positions)
    return json.dumps({'id': result.inserted_ids}, default=str)


@app.route('/order/<int:order_id>/position/<string:order_position_id>/prev', methods=['GET'])
def get_previous_order_position(order_id, order_position_id):
    result = []
    order_positions = db.order_positions.find({'order_id': order_id}).sort("position_id", ASCENDING)
    for order_position in order_positions:
        result.append(order_position)
    if len(result) and order_position_id == "0":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if order_position_id == item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/order/<int:order_id>/position/<string:order_position_id>/next', methods=['GET'])
def get_next_order_position(order_id, order_position_id):
    result = []
    order_positions = db.order_positions.find({'order_id': order_id}).sort("position_id", ASCENDING)
    for order_position in order_positions:
        result.append(order_position)
    if len(result) and order_position_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if item['id'] == order_position_id), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)

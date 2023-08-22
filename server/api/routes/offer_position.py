import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import ASCENDING

db = g.mongodb


@app.route('/offer/<int:offer_id>/position/<string:offer_position_id>', methods=['GET'])
@jwt_required()
def get_offer_position(offer_id, offer_position_id):
    offer_position = db.offer_positions.find_one({"offer_id": offer_id, "id": offer_position_id})
    return json.dumps(offer_position, default=str) if offer_position is not None else jsonify({})


@app.route('/offer/<int:offer_id>/position', methods=['GET'])
@jwt_required()
def get_all_offer_position(offer_id):
    result = []
    offer_positions = db.offer_positions.find({"offer_id": offer_id})
    for pos in offer_positions:
        result.append(pos)
    return json.dumps(result, default=str)


@app.route('/offer/<int:offer_id>/position/<string:offer_position_id>', methods=['DELETE'])
@jwt_required()
def delete_offer_position(offer_id, offer_position_id):
    deleted_offer_position = db.offer_positions.delete_one({"offer_id": offer_id, "id": offer_position_id})
    return json.dumps({'deleteCount': deleted_offer_position.deleted_count},
                      default=str) if deleted_offer_position.deleted_count == 1 else jsonify({})


@app.route('/offer/position', methods=['POST'])
@jwt_required()
def create_and_update_offer_position():
    data = request.json
    found_position = db.offer_positions.find_one({'id': data['positionId']})
    offer_position = {
        'id': data['positionId'],
        'group': data['positionGroup'],
        'offer_id': data['offerId'],
        'article_id': data['articleId'],
        'article_description': data['articleDescription'],
        'part_count': data['partCount'],
        'bend_type_id': data['bendTypeId'],
        'measures': data['measures'],
        'overall_length': data['overallLength'],
    }
    if found_position is None:
        result = db.offer_positions.insert_one(offer_position)
        return json.dumps({'id': result.inserted_id}, default=str)
    else:
        result = db.offer_positions.update_one({'id': data['positionId']}, {'$set': offer_position})
        return json.dumps({'modifiedCount': result.modified_count}, default=str)


@app.route('/offer/<int:source_offer_id>/position/copy/<int:target_offer_id>', methods=['POST'])
@jwt_required()
def copy_offer_position(source_offer_id, target_offer_id):
    data = request.json
    positions = [pos for pos in data['positions'].keys() if data['positions'][pos]]
    new_positions = []
    found_positions = db.offer_positions.find({'offer_id': source_offer_id, 'id': {'$in': positions}})
    for position in found_positions:
        position.pop("_id")
        position['offer_id'] = target_offer_id
        new_positions.append(position)
    result = db.offer_positions.insert_many(new_positions)
    return json.dumps({'id': result.inserted_ids}, default=str)


@app.route('/offer/<int:offer_id>/position/<string:offer_position_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_offer_position(offer_id, offer_position_id):
    result = []
    offer_positions = db.offer_positions.find({'offer_id': offer_id}).sort("position_id", ASCENDING)
    for offer_position in offer_positions:
        result.append(offer_position)
    if len(result) and offer_position_id == "0":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if offer_position_id == item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/offer/<int:offer_id>/position/<string:offer_position_id>/next', methods=['GET'])
@jwt_required()
def get_next_offer_position(offer_id, offer_position_id):
    result = []
    offer_positions = db.offer_positions.find({'offer_id': offer_id}).sort("position_id", ASCENDING)
    for offer_position in offer_positions:
        result.append(offer_position)
    if len(result) and offer_position_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if item['id'] == offer_position_id), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)

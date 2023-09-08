import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb.stahlpotsdam


@app.route('/cost_center', methods=['GET'])
@jwt_required()
def get_all_costs():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    articles = db.cost_center.find().sort('id', DESCENDING)
    for a in articles:
        result.append(a)

    filtered_result = _filter(result, filter_word, filter_operator, filter_column)
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/cost_center/<int:client_id>/<string:cost_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_cost(client_id, cost_id):
    result = []
    costs = db.cost_center.find({"client_id": client_id}).sort("id", ASCENDING)
    for cost_data in costs:
        result.append(cost_data)
    if cost_id == "0":
        if len(result) > 0:
            return json.dumps(result[len(result) - 1], default=str)
        else:
            return json.dumps({}, default=str)
    index = next((i for i, item in enumerate(result) if cost_id.replace("e", "/") == str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/cost_center/<int:client_id>/<string:cost_id>/next', methods=['GET'])
@jwt_required()
def get_next_cost(client_id, cost_id):
    result = []
    costs = db.cost_center.find({"client_id": client_id}).sort("id", ASCENDING)
    for cost_data in costs:
        result.append(cost_data)
    if cost_id == "0":
        if len(result) > 0:
            return json.dumps(result[0], default=str)
        else:
            return json.dumps({}, default=str)
    index = next((i for i, item in enumerate(result) if cost_id.replace("e", "/") == str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/cost_center/<string:cost_id>', methods=['POST'])
@jwt_required()
def update_cost(cost_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.cost_center.update_one({'id': cost_id.replace('_', '/')}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": cost_id}, default=str)


@app.route('/cost_center', methods=['DELETE'])
@jwt_required()
def delete_cost():
    data = request.json
    db.cost_center.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/cost_center/<string:cost_id>', methods=['GET'])
@jwt_required()
def get_cost(cost_id):
    cost = db.cost_center.find_one({"id": cost_id.replace('_', '/')})
    return json.dumps(cost, default=str) if cost is not None else jsonify({})

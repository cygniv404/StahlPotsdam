import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb


@app.route('/client', methods=['GET'])
@jwt_required()
def get_all_clients():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    clients = db.clients.find().sort('id', DESCENDING)
    for c in clients:
        result.append(c)

    filtered_result = [c for c in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(c[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/client', methods=['PUT'])
@jwt_required()
def create_client():
    last_client_id = 1
    data = request.json
    clients = db.clients.find().sort('id', DESCENDING).limit(1)
    for c in clients:
        last_client_id = c['id'] + 1
    new_client = data
    new_client['id'] = last_client_id
    db.clients.insert_one(new_client)
    return json.dumps({"id": new_client['id']}, default=str)


@app.route('/client/<int:client_id>', methods=['POST'])
@jwt_required()
def update_client(client_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.clients.update_one({'id': client_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": client_id}, default=str)


@app.route('/client', methods=['DELETE'])
@jwt_required()
def delete_client():
    data = request.json
    db.clients.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/client/<int:client_id>/cost', methods=['GET'])
@jwt_required()
def get_client_with_cost(client_id):
    client_found = db.clients.find_one({"id": client_id})
    if 999 < client_id < 600000:
        client_found = db.clients_not_binding.find_one({"id": client_id})
    if client_found is not None and len(client_found['cost_center_ids']) != 0:
        cost_found = db.cost_center.find_one({"id": client_found['cost_center_ids'][0]}, {"_id": 0})
        return json.dumps({"client": client_found, "cost": cost_found}, default=str)
    elif client_found is not None:
        return json.dumps({"client": client_found}, default=str)
    else:
        return jsonify({})


@app.route('/client/<int:client_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_client(client_id):
    result = []
    clients = db.clients.find().sort("id", ASCENDING)
    if 999 < client_id < 600000:
        clients = db.clients_not_binding.find().sort("id", ASCENDING)
    for client_data in clients:
        result.append(client_data)
    if client_id == 0:
        return json.dumps(result[len(result) - 1], default=str)

    index = next((i for i, item in enumerate(result) if str(client_id) == str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/client/<int:client_id>/next', methods=['GET'])
@jwt_required()
def get_next_client(client_id):
    result = []
    clients = db.clients.find().sort("id", ASCENDING)
    if 999 < client_id < 600000:
        clients = db.clients_not_binding.find().sort("id", ASCENDING)
    for client_data in clients:
        result.append(client_data)
    if client_id == 0:
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if str(client_id) == str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/client/<int:client_id>', methods=['GET'])
@jwt_required()
def get_client(client_id):
    client_ = db.clients.find_one({"id": client_id})
    return json.dumps(client_, default=str) if client_ is not None else jsonify({})

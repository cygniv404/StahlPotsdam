import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb


@app.route('/order_method/list', methods=['GET'])
@jwt_required()
def get_order_methods_list():
    result = []
    methods = db.order_method.find().sort('id', ASCENDING)
    for m in methods:
        result.append(m)
    return json.dumps(result, default=str)


@app.route('/order_method', methods=['GET'])
@jwt_required()
def get_all_order_methods():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    methods = db.order_method.find().sort('value', DESCENDING)
    for m in methods:
        result.append(m)

    filtered_result = [m for m in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(m[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/order_method', methods=['PUT'])
@jwt_required()
def create_order_method():
    last_method_id = 1
    data = request.json
    methods = db.order_method.find().sort('id', DESCENDING).limit(1)
    for m in methods:
        last_method_id = m['id'] + 1
    new_method = data
    new_method['id'] = last_method_id
    db.order_method.insert_one(new_method)
    return json.dumps({"id": new_method['id']}, default=str)


@app.route('/order_method', methods=['DELETE'])
@jwt_required()
def delete_order_method():
    data = request.json
    db.order_method.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   ORDER   #
@app.route('/orders_grid', methods=['GET'])
@jwt_required()
def get_all_orders():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    orders = db.orders.find().sort('id', DESCENDING)
    for o in orders:
        result.append(o)

    filtered_result = [o for o in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(o[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/orders_grid/<int:order_id>', methods=['POST'])
@jwt_required()
def update_order(order_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.orders.update_one({'id': order_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": order_id}, default=str)


@app.route('/orders_grid', methods=['DELETE'])
@jwt_required()
def delete_order():
    data = request.json
    db.orders.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/order/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    order = db.orders.find_one({"id": order_id})
    return json.dumps(order, default=str) if order is not None else jsonify({})


@app.route('/order/<int:order_id>', methods=['POST'])
@jwt_required()
def create_and_update_order(order_id):
    last_order_id = 300000
    last_not_binding_client = 1000
    if db.orders.count() > 0:
        last_order = db.orders.find().sort("id", DESCENDING).limit(1)
        for _order in last_order:
            last_order_id = _order['id'] + 1

    data = request.json
    if data['clientId'] == 0:
        if db.clients_not_binding.count() > 0:
            last_client = db.clients_not_binding.find().sort("id", DESCENDING).limit(1)
            for _client in last_client:
                last_not_binding_client = _client['id'] + 1
        client_data = {
            'id': last_not_binding_client,
            'alias': data['alias'],
            'name1': data['address1Name1'],
            'name2': data['address1Name2'],
            'street': data['address1Street'],
            'postal_code': data['address1Post'],
            'location': data['address1Place'],
        }
        db.clients_not_binding.insert_one(client_data)

    if order_id == 0 or request.args.get('copy') == 'true':
        order = {
            'id': last_order_id,
            'client_id': last_not_binding_client if data['clientId'] == 0 else data['clientId'],
            'cost_id': data['costId'],
            'order_created_at': data['orderCreatedAt'],

            'client_alias': data['alias'],
            'client_address1_name1': data['address1Name1'],
            'client_address1_name2': data['address1Name2'],
            'client_address1_street': data['address1Street'],
            'client_address1_post': data['address1Post'],
            'client_address1_place': data['address1Place'],

            'cost_address2_name1': data['address2Name1'],
            'cost_address2_name2': data['address2Name2'],
            'cost_address2_street': data['address2Street'],
            'cost_address2_post': data['address2Post'],
            'cost_address2_place': data['address2Place'],
            'sheet': data['bleche'],
            'hem': data['hem'],
            'stahl6': data['stahl6'],
            'stahl8': data['stahl8'],
            'stahl10': data['stahl10'],
            'stahl12_32': data['stahl12_32'],
            'matten_q': data['mattenQ'],
            'matten_r': data['mattenR'],
            'hea': data['hea'],
            'heb': data['heb'],
            'stabstahl': data['stabstahl'],
            'bv_1': data['bv_1'],
            'bv_2': data['bv_2'],
            'bv_3': data['bv_3'],
            'ipe': data['ipe_u'],

            'bem': data['bem'],
            'bearbeiter': data['bearbeiter'],
            'bauteilt': data['bauteilt'],
            'plan': data['plan'],
            'bestelldatum': data['bestelldatum'],
            'lieferdatum': data['lieferdatum'],
            'bestellart': data['bestellart'],
            'versandart': data['versandart'],
            'mehrwertssteuer': data['mehrwertssteuer']
        }
        db.orders.insert_one(order)
        return jsonify({'id': last_order_id})
    if order_id > 0:
        order = {
            'client_alias': data['alias'],
            'client_address1_name1': data['address1Name1'],
            'client_address1_name2': data['address1Name2'],
            'client_address1_street': data['address1Street'],
            'client_address1_post': data['address1Post'],
            'client_address1_place': data['address1Place'],

            'cost_id': data['costId'],
            'cost_address2_name1': data['address2Name1'],
            'cost_address2_name2': data['address2Name2'],
            'cost_address2_street': data['address2Street'],
            'cost_address2_post': data['address2Post'],
            'cost_address2_place': data['address2Place'],
            'sheet': data['bleche'],
            'hem': data['hem'],
            'stahl6': data['stahl6'],
            'stahl8': data['stahl8'],
            'stahl10': data['stahl10'],
            'stahl12_32': data['stahl12_32'],
            'matten_q': data['mattenQ'],
            'matten_r': data['mattenR'],
            'hea': data['hea'],
            'heb': data['heb'],
            'stabstahl': data['stabstahl'],
            'bv_1': data['bv_1'],
            'bv_2': data['bv_2'],
            'bv_3': data['bv_3'],
            'ipe': data['ipe_u'],

            'bem': data['bem'],
            'bearbeiter': data['bearbeiter'],
            'bauteilt': data['bauteilt'],
            'plan': data['plan'],
            'bestelldatum': data['bestelldatum'],
            'lieferdatum': data['lieferdatum'],
            'bestellart': data['bestellart'],
            'versandart': data['versandart'],
            'mehrwertssteuer': data['mehrwertssteuer']
        }

        db.orders.update_one({'id': order_id}, {'$set': order})
        return jsonify({'id': order_id})


@app.route('/order/<string:order_id>/prev', methods=['GET'])
@jwt_required()
def get_previous_order(order_id):
    result = []
    orders = db.orders.find().sort("id", ASCENDING)
    for order in orders:
        result.append(order)
    if order_id == "0":
        return json.dumps(result[len(result) - 1], default=str)

    index = next((i for i, item in enumerate(result) if order_id in str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/order/<string:order_id>/next', methods=['GET'])
@jwt_required()
def get_next_order(order_id):
    result = []
    orders = db.orders.find().sort("id", ASCENDING)
    for order in orders:
        result.append(order)
    if order_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if order_id in str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/order/cutfold_correction/<string:order_id>', methods=['POST'])
@jwt_required()
def save_order_cutfold_correction(order_id):
    data = request.json
    cutfold_correction = {
        'order_id': int(order_id),
        'cut': data['cutCorrection'],
        'fold': data['foldCorrection']
    }
    db.cutfold_correction.insert_one(cutfold_correction)
    return jsonify({'id': order_id}), 200


@app.route('/order/mat_correction/<string:order_id>', methods=['POST'])
@jwt_required()
def save_order_mat_correction(order_id):
    data = request.json
    mat_correction = {
        'order_id': int(order_id),
        'mat': data['matCorrection'],
    }
    db.mat_correction.insert_one(mat_correction)
    return jsonify({'id': order_id}), 200

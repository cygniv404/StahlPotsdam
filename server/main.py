import datetime
import json
import logging
import os
from pprint import pprint
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager, jwt_required
from flask_bcrypt import Bcrypt
from bson import ObjectId
from dotenv import load_dotenv
from pymongo import MongoClient, DESCENDING, ASCENDING
from flask import Flask, request, jsonify
from flask_cors import CORS


class JSONEncoder(json.JSONEncoder):
    """extend json-encoder class"""

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, set):
            return list(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


load_dotenv()
logging.basicConfig(filename='logs/debug.log', level=logging.INFO,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

app = Flask(__name__)
CORS(app)
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['JWT_SECRET_KEY'] = os.getenv('SECRET')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)
app.config['CORS_HEADERS'] = 'application/json'
flask_bcrypt = Bcrypt(app)
jwt = JWTManager(app)
app.json_encoder = JSONEncoder
MONGODB_URL = os.getenv('MONGODB_URL')
client = MongoClient(MONGODB_URL)
db = client.stahlpotsdam

from user import *


def _filter(text, filter_operator, filter_word):
    def _contains():
        return True if filter_word in str(text) else False

    def _equals():
        return True if filter_word == str(text) else False

    def _equals_int():
        return True if int(filter_word) == int(text) else False

    def _not_equals():
        return True if int(filter_word) != int(text) else False

    def _starts_with():
        return True if text.startswith(filter_word) else False

    def _lesser():
        return True if int(text) < int(filter_word) else False

    def _lesser_or_equals():
        return True if int(text) <= int(filter_word) else False

    def _greater():
        return True if int(text) > int(filter_word) else False

    def _greater_or_equals():
        return True if int(text) >= int(filter_word) else False

    def _ends_with():
        return True if text.endswith(filter_word) else False

    def _is_empty():
        return True if text == '' else False

    def _is_not_empty():
        return True if text != '' else False

    def _before():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() < datetime.datetime.strptime(filter_word,
                                                                                                "%Y-%m-%d").date()

    def _on_or_before():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() <= datetime.datetime.strptime(filter_word,
                                                                                                 "%Y-%m-%d").date()

    def _on_or_after():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() >= datetime.datetime.strptime(filter_word,
                                                                                                 "%Y-%m-%d").date()

    def _after():
        return datetime.datetime.strptime(text, "%Y-%m-%d").date() > datetime.datetime.strptime(filter_word,
                                                                                                "%Y-%m-%d").date()

    def _is():
        return True if str(text).lower() == filter_word else False

    def _not():
        return True if str(text).lower() != filter_word else False

    switcher = {
        "contains": _contains,
        "equals": _equals,
        "startsWith": _starts_with,
        "endsWith": _ends_with,
        "isEmpty": _is_empty,
        "isNotEmpty": _is_not_empty,
        "=": _equals_int,
        "!=": _not_equals,
        "<": _lesser,
        "<=": _lesser_or_equals,
        ">": _greater,
        ">=": _greater_or_equals,
        "before": _before,
        'is': _is,
        'not': _not,
        'onOrBefore': _on_or_before,
        'after': _after,
        'onOrAfter': _on_or_after
    }
    return switcher.get(filter_operator, _contains)()


def _sort(el, sort_column):
    return el.get(sort_column)


# FILE UPLOAD   #
@app.route('/files', methods=['POST'])
def save_file():
    data = request.json
    file = {
        'content': data['file'],
        'name': data['fileName']
    }
    db_collection = data['viewer']
    document_id = data['documentId']
    result = db.files.insert_one(file)
    file_id = result.inserted_id
    if document_id and db_collection:
        document = db[db_collection].find_one({'id': document_id})
        if document:
            result = db[db_collection].update_one({'id': document_id}, {'$set': {'file_id': file_id}})
            return json.dumps({'id': file_id, 'updated_document': True},
                              default=str) if result.matched_count else jsonify(
                {})
        else:
            return json.dumps({}, default=str)
    else:
        return json.dumps({'id': file_id, 'updated_document': False}, default=str) if result.inserted_id else jsonify(
            {})


@app.route('/files/<string:file_id>', methods=['GET'])
def get_file(file_id):
    result = db.files.find_one(ObjectId(file_id))
    return json.dumps(result, default=str) if result is not None else jsonify({})


@app.route('/files/<string:file_id>', methods=['DELETE'])
def delete_file(file_id):
    data = request.json
    db_collection = data['viewer']
    document_id = data['documentId']
    if document_id and db_collection:
        db[db_collection].update_one({'id': document_id}, {'$set': {'file_id': None}})
    result = db.files.delete_one({'_id': ObjectId(file_id)})
    return json.dumps({'id': file_id}, default=str) if result.deleted_count == 1 else jsonify({})


# DATAGRID COLUMN VISIBILITY    #
@app.route('/dataGrid_column_visibility/<string:viewer_id>', methods=['POST'])
def update_dataGrid_column_visibility(viewer_id):
    grid = db.dataGrid_column_visibility.find_one({'id': viewer_id})
    grid_visibility = request.json
    if grid is None:
        new_grid = {
            'id': viewer_id,
            'columns_visibility': grid_visibility
        }
        result = db.dataGrid_column_visibility.insert_one(new_grid)
        return json.dumps({'id': result.inserted_id}, default=str) if result.inserted_id is not None else jsonify({})

    else:
        result = db.dataGrid_column_visibility.update_one({'id': viewer_id},
                                                          {'$set': {'columns_visibility': grid_visibility}})
        return json.dumps({'id': result.matched_count}, default=str) if result.matched_count is not None else jsonify(
            {})


@app.route('/dataGrid_column_visibility/<string:viewer_id>', methods=['GET'])
def get_dataGrid_column_visibility(viewer_id):
    grid = db.dataGrid_column_visibility.find_one({'id': viewer_id})
    return json.dumps({'columns_visibility': grid['columns_visibility']},
                      default=str) if grid is not None else jsonify({})


# SYSTEM  #
@app.route('/system', methods=['GET'])
@jwt_required()
def get_system():
    system = db.system.find_one()
    result = {'shipping': [], 'order': []}
    shipping_methods = db.shipping_method.find().sort('id', ASCENDING)
    order_methods = db.order_method.find().sort('id', ASCENDING)
    for m in shipping_methods:
        result['shipping'].append({'label': m['method'], 'value': m['id']})
    for m in order_methods:
        result['order'].append({'label': m['method'], 'value': m['id']})
    return json.dumps({**system, 'shipping_method': result['shipping'], 'order_method': result['order']}, default=str)


# SHIPPING METHODS    #
@app.route('/shipping_method/list', methods=['GET'])
def get_shipping_methods_list():
    result = []
    methods = db.shipping_method.find().sort('id', ASCENDING)
    for m in methods:
        result.append(m)
    return json.dumps(result, default=str)


@app.route('/shipping_method', methods=['GET'])
def get_all_shipping_methods():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    methods = db.shipping_method.find().sort('value', DESCENDING)
    for m in methods:
        result.append(m)

    filtered_result = [m for m in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(m[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/shipping_method', methods=['PUT'])
def create_shipping_method():
    last_method_id = 1
    data = request.json
    methods = db.shipping_method.find().sort('id', DESCENDING).limit(1)
    for m in methods:
        last_method_id = m['id'] + 1
    new_method = data
    new_method['id'] = last_method_id
    db.shipping_method.insert_one(new_method)
    return json.dumps({"id": new_method['id']}, default=str)


@app.route('/shipping_method', methods=['DELETE'])
def delete_shipping_method():
    data = request.json
    db.shipping_method.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


# ORDER METHODS    #
@app.route('/order_method/list', methods=['GET'])
def get_order_methods_list():
    result = []
    methods = db.order_method.find().sort('id', ASCENDING)
    for m in methods:
        result.append(m)
    return json.dumps(result, default=str)


@app.route('/order_method', methods=['GET'])
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
def delete_order_method():
    data = request.json
    db.order_method.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   ORDER   #
@app.route('/orders_grid', methods=['GET'])
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
def update_order(order_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.orders.update_one({'id': order_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": order_id}, default=str)


@app.route('/orders_grid', methods=['DELETE'])
def delete_order():
    data = request.json
    db.orders.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/order/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = db.orders.find_one({"id": order_id})
    return json.dumps(order, default=str) if order is not None else jsonify({})


@app.route('/order/<int:order_id>', methods=['POST'])
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
def save_order_mat_correction(order_id):
    data = request.json
    mat_correction = {
        'order_id': int(order_id),
        'mat': data['matCorrection'],
    }
    db.mat_correction.insert_one(mat_correction)
    return jsonify({'id': order_id}), 200


#   OFFER   #
@app.route('/offer/<int:offer_id>', methods=['GET'])
def get_offer(offer_id):
    article = db.offers.find_one({"id": offer_id})
    return json.dumps(article, default=str) if article is not None else jsonify({})


@app.route('/offer/<int:offer_id>', methods=['POST'])
def create_and_update_offer(offer_id):
    last_order_id = 300000
    last_offer_id = 200000
    last_not_binding_client = 1000
    if db.offers.count() > 0:
        last_offer = db.offers.find().sort("id", DESCENDING).limit(1)
        for _offer in last_offer:
            last_offer_id = _offer['id'] + 1

    data = request.json
    client_id = data["clientId"]

    # copy
    if 'copy' in request.args and request.args.get('copy') == 'true' and db.offers.find_one(
            {"id": offer_id}) is not None:
        if db.clients_not_binding.find_one({"id": client_id}) is None and db.clients.find_one(
                {"id": client_id}) is None:
            if db.clients_not_binding.count() > 0:
                last_client = db.clients_not_binding.find().sort("id", DESCENDING).limit(1)
                for _client in last_client:
                    last_not_binding_client = _client['id'] + 1
            client_id = last_not_binding_client
            client_data = {
                'id': client_id,
                'alias': data['alias'],
                'address1_name1': data['address1Name1'],
                'address1_name2': data['address1Name2'],
                'address1_street': data['address1Street'],
                'address1_post': data['address1Post'],
                'address1_place': data['address1Place'],
            }
            db.clients_not_binding.insert_one(client_data)
        if db.orders.count() > 0:
            last_order = db.orders.find().sort("id", DESCENDING).limit(1)
            for _order in last_order:
                last_order_id = _order['id'] + 1
        order = {
            'id': last_order_id,
            'client_id': client_id,
            'cost_id': data['costId'],

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
    else:
        # update
        if db.offers.find_one({"id": offer_id}) is not None:
            offer = {
                'client_id': data['clientId'],
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
            db.offers.update_one({'id': offer_id}, {'$set': offer})
            return jsonify({'id': offer_id})
        else:
            # create
            offer = {
                'id': last_offer_id,
                'client_id': client_id,
                'cost_id': data['costId'],

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
            db.offers.insert_one(offer)
            return jsonify({'id': last_offer_id})


@app.route('/offer/<string:offer_id>/prev', methods=['GET'])
def get_previous_offer(offer_id):
    result = []
    offers = db.offers.find().sort("id", ASCENDING)
    for offer in offers:
        result.append(offer)
    if offer_id == "0":
        return json.dumps(result[len(result) - 1], default=str)

    index = next((i for i, item in enumerate(result) if offer_id in str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/offer/<string:offer_id>/next', methods=['GET'])
def get_next_offer(offer_id):
    result = []
    offers = db.offers.find().sort("id", ASCENDING)
    for offer in offers:
        result.append(offer)
    if offer_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if offer_id in str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/offer/cutfold_correction/<string:offer_id>', methods=['POST'])
def save_offer_cutfold_correction(offer_id):
    data = request.json
    cutfold_correction = {
        'offer_id': int(offer_id),
        'cut': data['cutCorrection'],
        'fold': data['foldCorrection']
    }
    db.cutfold_correction.insert_one(cutfold_correction)
    return jsonify({'id': offer_id}), 200


@app.route('/offer/mat_correction/<string:offer_id>', methods=['POST'])
def save_offer_mat_correction(offer_id):
    data = request.json
    mat_correction = {
        'offer_id': int(offer_id),
        'mat': data['matCorrection'],
    }
    db.mat_correction.insert_one(mat_correction)
    return jsonify({'id': offer_id}), 200


#   CLIENT SPECIAL PRICE    #
@app.route('/client_special_price/<string:collection>', methods=['POST'])
def save_special_price(collection):
    last_price_id = 1
    new_special = request.json
    prices = db[collection].find().sort('id', DESCENDING).limit(1)
    for p in prices:
        last_price_id = p['id'] + 1
    new_special['id'] = last_price_id
    db[collection].insert_one(new_special)
    return json.dumps({"id": new_special['id']}, default=str)


#   client_article_special_price
@app.route('/client_article_special_price', methods=['GET'])
def get_all_article_special_price():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    prices = db.client_article_special_price.find().sort('id', DESCENDING)
    for p in prices:
        result.append(p)

    filtered_result = [p for p in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(p[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/client_article_special_price/<int:price_id>', methods=['POST'])
def update_article_special_price(price_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.client_article_special_price.update_one({'id': price_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": price_id}, default=str)


@app.route('/client_article_special_price', methods=['DELETE'])
def delete_article_special_price():
    data = request.json
    db.client_article_special_price.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   client_article_group_special_price
@app.route('/client_article_group_special_price', methods=['GET'])
def get_all_article_group_special_price():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    prices = db.client_article_group_special_price.find().sort('id', DESCENDING)
    for p in prices:
        result.append(p)

    filtered_result = [p for p in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(p[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/client_article_group_special_price/<int:price_id>', methods=['POST'])
def update_article_group_special_price(price_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.client_article_group_special_price.update_one({'id': price_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": price_id}, default=str)


@app.route('/client_article_group_special_price', methods=['DELETE'])
def delete_article_group_special_price():
    data = request.json
    db.client_article_group_special_price.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   CLIENT  #
@app.route('/client', methods=['GET'])
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
def update_client(client_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.clients.update_one({'id': client_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": client_id}, default=str)


@app.route('/client', methods=['DELETE'])
def delete_client():
    data = request.json
    db.clients.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/client/<int:client_id>/cost', methods=['GET'])
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
def get_client(client_id):
    client_ = db.clients.find_one({"id": client_id})
    return json.dumps(client_, default=str) if client_ is not None else jsonify({})


#   INCOMING MATERIAL
@app.route('/incoming_material', methods=['GET'])
def get_all_materials():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    materials = db.incoming_materials.find().sort('id', DESCENDING)
    for m in materials:
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


@app.route('/incoming_material', methods=['POST'])
def save_material():
    data = request.json
    last_incoming_material_id = 1
    if db.incoming_materials.count() > 0:
        last_material = db.incoming_materials.find().sort("id", DESCENDING).limit(1)
        for _material in last_material:
            last_incoming_material_id = _material['id'] + 1
    new_material = {'id': last_incoming_material_id,
                    'article_id': data['articleId'],
                    'supplier_id': int(data['supplierId']),
                    'date': data['incomingDate'],
                    'price': float(data['deliveryPrice']),
                    'amount': float(data['deliveryAmount'])
                    }
    article = db.articles.find_one({'id': new_material['article_id']})
    new_article_stock = article['stock'] + float(new_material['amount'])
    new_article_purchase_price = (float(new_material['price']) + article['purchase_price']) / 2
    db.articles.update_one({'id': new_material['article_id']},
                           {'$set': {'stock': new_article_stock, 'purchase_price': new_article_purchase_price}})
    db.incoming_materials.insert_one(new_material)
    return json.dumps({"id": new_material['id']}, default=str)


@app.route('/incoming_material/<int:material_id>', methods=['POST'])
def update_material(material_id):
    data = request.json
    field = data['field']
    value = data['value']
    if field == 'price' or field == 'amount':
        material = db.incoming_materials.find_one({'id': material_id})
        article_id = material['article_id']
        article = db.articles.find_one({'id': article_id})
        if field == 'price':
            new_article_purchase_price = (float(value) + (article['purchase_price'] * 2 - material['price'])) / 2
            db.articles.update_one({'id': article_id}, {'$set': {'purchase_price': new_article_purchase_price}})
        if field == 'amount':
            new_article_stock = article['stock'] - material['amount'] + float(value)
            db.articles.update_one({'id': article_id}, {'$set': {'stock': new_article_stock}})

    result = db.incoming_materials.update_one({'id': material_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": material_id}, default=str)


@app.route('/incoming_material', methods=['DELETE'])
def delete_material():
    data = request.json
    db.incoming_materials.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   INCOMING INVOICE
def get_amounts(rows):
    brutto_amount = 0
    open_amount = 0
    deadline_1_amount = 0
    deadline_2_amount = 0
    deadline_3_amount = 0
    for r in rows:
        brutto_amount += r['brutto_amount']
        open_amount += r['open_amount']
        deadline_1_amount += r['deadline_1_amount']
        deadline_2_amount += r['deadline_2_amount']
        deadline_3_amount += r['deadline_3_amount']
    return {'brutto_amount': "%.2f" % brutto_amount,
            'open_amount': "%.2f" % open_amount,
            'deadline_1_amount': "%.2f" % deadline_1_amount,
            'deadline_2_amount': "%.2f" % deadline_2_amount,
            'deadline_3_amount': "%.2f" % deadline_3_amount,
            }


@app.route('/incoming_invoices', methods=['GET'])
def get_all_incoming_invoices():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    invoices = db.incoming_invoices.find().sort('id', DESCENDING)
    for i in invoices:
        result.append(i)

    filtered_result = [i for i in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(i[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'amounts': get_amounts(sorted_result),
         'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/incoming_invoices', methods=['POST'])
def save_incoming_invoice():
    data = request.json
    new_invoice = {
        'id': int(data['invoiceId']),
        'supplier_id': int(data['supplierId']),
        'date': data['incomingDate'],
        'brutto_amount': float(data['bruttoAmount']),
        'netto_amount': float(data['nettoAmount']),
        'payment_target_date': data['paymentTargetDate'],
        'supplier_alias': data['supplierAlias'],
        'supplier_name1': data['supplierName1'],
        'supplier_name2': data['supplierName2'],
        'deadline_1_per': int(data['deadline1Per']),
        'deadline_2_per': int(data['deadline2Per']),
        'deadline_3_per': int(data['deadline3Per']),
        'deadline_1_amount': float(data['deadline1Amount']),
        'deadline_2_amount': float(data['deadline2Amount']),
        'deadline_3_amount': float(data['deadline3Amount']),
        'deadline_1_date': data['deadline1Date'],
        'deadline_2_date': data['deadline2Date'],
        'deadline_3_date': data['deadline3Date'],
        'payed': False,
        'open_amount': float(data['bruttoAmount']),
        'payment_date': data['paymentDate'],
        'payment_method': data['paymentMethod'],
        'file_id': data['fileId'],
    }
    db.incoming_invoices.insert_one(new_invoice)
    return json.dumps({"id": new_invoice['id']}, default=str)


@app.route('/incoming_invoices/<int:invoice_id>', methods=['POST'])
def update_incoming_invoice(invoice_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.incoming_invoices.update_one({'id': invoice_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": invoice_id}, default=str)


@app.route('/incoming_invoices/pay/<int:invoice_id>', methods=['POST'])
def pay_incoming_invoice(invoice_id):
    data = request.json
    payment_date = data['paymentDate']
    payment_method = data['paymentMethod']
    open_amount = data['openAmount']
    payed_amount = data['payedAmount']
    rest_amount = float(open_amount) - float(payed_amount)
    discount_id = data['discount']
    invoice = db.incoming_invoices.find_one({'id': invoice_id})
    invoice['payment_method'] = payment_method
    invoice['payment_date'] = payment_date
    if discount_id != 0:
        invoice[f'deadline_{discount_id}_amount'] = rest_amount
    invoice['open_amount'] = float(invoice['open_amount']) - float(payed_amount)
    if rest_amount == 0:
        invoice['payed'] = True
        invoice['open_amount'] = 0
        invoice[f'deadline_{discount_id}_amount'] = 0
    result = db.incoming_invoices.update_one({'id': invoice_id}, {"$set": invoice})
    if result.modified_count > 0:
        return json.dumps({"id": invoice_id}, default=str)


@app.route('/incoming_invoices', methods=['DELETE'])
def delete_incoming_invoices():
    data = request.json
    db.incoming_invoices.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   SUPPLIER
@app.route('/supplier', methods=['GET'])
def get_all_suppliers():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    suppliers = db.suppliers.find().sort('id', DESCENDING)
    for s in suppliers:
        result.append(s)

    filtered_result = [s for s in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(s[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/supplier/<string:supplier_id>/prev', methods=['GET'])
def get_previous_supplier(supplier_id):
    result = []
    suppliers = db.suppliers.find().sort("id", ASCENDING)
    for supplier in suppliers:
        result.append(supplier)
    if supplier_id == "0":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if supplier_id in str(item['id'])), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/supplier/<string:supplier_id>/next', methods=['GET'])
def get_next_supplier(supplier_id):
    try:
        result = []
        suppliers = db.suppliers.find().sort("id", ASCENDING)
        for supplier in suppliers:
            result.append(supplier)
        if supplier_id == "0":
            return json.dumps(result[0], default=str)
        index = next((i for i, item in enumerate(result) if supplier_id in str(item['id'])), -1)
        if index == -1:
            return json.dumps({}, default=str)
        if index == len(result) - 1:
            return json.dumps(result[0], default=str)
        else:
            return json.dumps(result[index + 1], default=str)
    except Exception as e:
        logging.error(e)


@app.route('/supplier', methods=['PUT'])
def create_supplier():
    last_supplier_id = 1
    data = request.json
    suppliers = db.suppliers.find().sort('id', DESCENDING).limit(1)
    for s in suppliers:
        last_supplier_id = s['id'] + 1
    new_supplier = data
    new_supplier['id'] = last_supplier_id
    db.suppliers.insert_one(new_supplier)
    return json.dumps({"id": new_supplier['id']}, default=str)


@app.route('/supplier/<int:supplier_id>', methods=['POST'])
def update_supplier(supplier_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.suppliers.update_one({'id': supplier_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": supplier_id}, default=str)


@app.route('/supplier', methods=['DELETE'])
def delete_supplier():
    data = request.json
    db.suppliers.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/supplier/<int:supplier_id>', methods=['GET'])
def get_supplier(supplier_id):
    supplier = db.suppliers.find_one({"id": supplier_id})
    return json.dumps(supplier, default=str) if supplier is not None else jsonify({})


#   COST CENTER   #
@app.route('/cost_center', methods=['GET'])
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

    filtered_result = [a for a in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(a[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/cost_center/<int:client_id>/<string:cost_id>/prev', methods=['GET'])
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
def update_cost(cost_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.cost_center.update_one({'id': cost_id.replace('_', '/')}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": cost_id}, default=str)


@app.route('/cost_center', methods=['DELETE'])
def delete_cost():
    data = request.json
    db.cost_center.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/cost_center/<string:cost_id>', methods=['GET'])
def get_cost(cost_id):
    cost = db.cost_center.find_one({"id": cost_id.replace('_', '/')})
    return json.dumps(cost, default=str) if cost is not None else jsonify({})


#   ARTICLES    #

@app.route('/article', methods=['GET'])
def get_all_articles():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    articles = db.articles.find().sort('id', DESCENDING)
    for a in articles:
        result.append(a)

    filtered_result = [a for a in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(a[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/article/<string:article_id>/prev', methods=['GET'])
def get_previous_article(article_id):
    result = []
    articles = db.articles.find().sort("id", ASCENDING)
    for article in articles:
        result.append(article)
    if article_id == "0":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if article_id.replace('_', '/') in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/article/<string:article_id>/next', methods=['GET'])
def get_next_article(article_id):
    result = []
    articles = db.articles.find().sort("id", ASCENDING)
    for article in articles:
        result.append(article)
    if article_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if article_id.replace('_', '/') in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


@app.route('/article', methods=['PUT'])
def create_article():
    new_article = request.json
    db.articles.insert_one(new_article)
    return json.dumps({"id": new_article['id']}, default=str)


@app.route('/article/<string:article_id>', methods=['POST'])
def update_article(article_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.articles.update_one({'id': article_id.replace('_', '/')}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": article_id}, default=str)


@app.route('/article', methods=['DELETE'])
def delete_article():
    data = request.json
    db.articles.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/article/<string:article_id>', methods=['GET'])
def get_article(article_id):
    article = db.articles.find_one({"id": {'$regex': f'^{article_id.replace("_", "/")}$', '$options': 'i'}})
    return json.dumps(article, default=str) if article is not None else jsonify({})


#   ARTICLE GROUPS  #
@app.route('/article_groups', methods=['GET'])
def get_all_article_groups():
    page = int(request.args.get('page'))
    page_size = int(request.args.get('pageSize'))
    filter_word = request.args.get('filter')
    filter_column = request.args.get('filterColumn')
    filter_operator = request.args.get('filterOperator')
    sort_order = request.args.get('sortOrder')
    sort_column = request.args.get('sortColumn')

    result = []
    articles = db.article_groups.find().sort('id', DESCENDING)
    for a in articles:
        result.append(a)

    filtered_result = [a for a in result if
                       (filter_word == '' and filter_column in ['isEmpty', 'isNotEmpty'])
                       or (filter_word == '' and filter_operator in ['=', '!=', '<', '<=', '>=', '>'])
                       or filter_operator == ''
                       or filter_column == ''
                       or filter_word == '' and filter_operator in ['is', 'not', 'before', 'onOrBefore', 'after',
                                                                    'onOrAfter']
                       or _filter(a[filter_column], filter_operator, filter_word)]
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/article_groups/<string:article_group_id>', methods=['POST'])
def update_article_group(article_group_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.article_groups.update_one({'id': article_group_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": article_group_id}, default=str)


@app.route('/article_groups', methods=['DELETE'])
def delete_article_group():
    data = request.json
    db.article_groups.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/article_groups/<string:article_group_id>', methods=['GET'])
def get_article_group(article_group_id):
    article_group = db.article_groups.find_one({"id": article_group_id})
    return json.dumps(article_group, default=str) if article_group is not None else jsonify({})


@app.route('/article_groups/<string:article_group_id>/prev', methods=['GET'])
def get_previous_article_group(article_group_id):
    result = []
    articles = db.article_groups.find().sort("id", ASCENDING)
    for article in articles:
        result.append(article)
    if article_group_id == "0":
        return json.dumps(result[len(result) - 1], default=str)
    index = next((i for i, item in enumerate(result) if article_group_id in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == 0:
        return json.dumps(result[len(result) - 1], default=str)
    else:
        return json.dumps(result[index - 1], default=str)


@app.route('/article_groups/<string:article_group_id>/next', methods=['GET'])
def get_next_article_group(article_group_id):
    result = []
    articles = db.article_groups.find().sort("id", ASCENDING)
    for article in articles:
        result.append(article)
    if article_group_id == "0":
        return json.dumps(result[0], default=str)
    index = next((i for i, item in enumerate(result) if article_group_id in item['id']), -1)
    if index == -1:
        return json.dumps({}, default=str)
    if index == len(result) - 1:
        return json.dumps(result[0], default=str)
    else:
        return json.dumps(result[index + 1], default=str)


#   POSITIONS   #

@app.route('/position/<string:position_type>/<string:position_id>/prev', methods=['GET'])
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


# BEND TYPE #
#  MAT #
@app.route('/bend_type/mat/<string:bend_type_id>/prev', methods=['GET'])
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
def get_bend_type(bend_type_id):
    bend_type = db.images_coordinates.find_one({"id": bend_type_id})
    return json.dumps(bend_type, default=str) if bend_type is not None else jsonify({})


@app.route('/bend_type/others', methods=['GET'])
def get_all_bend_type():
    result = []
    bend_types = db.images_coordinates.find().sort('id', ASCENDING)
    for bend_type in bend_types:
        result.append(bend_type)
    return json.dumps(result, default=str)


#   ORDER POSITION  #
@app.route('/order/<int:order_id>/position/<string:order_position_id>', methods=['GET'])
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


#   OFFER POSITION  #
@app.route('/offer/<int:offer_id>/position/<string:offer_position_id>', methods=['GET'])
def get_offer_position(offer_id, offer_position_id):
    offer_position = db.offer_positions.find_one({"offer_id": offer_id, "id": offer_position_id})
    return json.dumps(offer_position, default=str) if offer_position is not None else jsonify({})


@app.route('/offer/<int:offer_id>/position', methods=['GET'])
def get_all_offer_position(offer_id):
    result = []
    offer_positions = db.offer_positions.find({"offer_id": offer_id})
    for pos in offer_positions:
        result.append(pos)
    return json.dumps(result, default=str)


@app.route('/offer/<int:offer_id>/position/<string:offer_position_id>', methods=['DELETE'])
def delete_offer_position(offer_id, offer_position_id):
    deleted_offer_position = db.offer_positions.delete_one({"offer_id": offer_id, "id": offer_position_id})
    return json.dumps({'deleteCount': deleted_offer_position.deleted_count},
                      default=str) if deleted_offer_position.deleted_count == 1 else jsonify({})


@app.route('/offer/position', methods=['POST'])
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


if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

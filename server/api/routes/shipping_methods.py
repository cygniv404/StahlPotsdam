import json

from flask import g, current_app as app, request
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb


@app.route('/shipping_method/list', methods=['GET'])
@jwt_required()
def get_shipping_methods_list():
    result = []
    methods = db.shipping_method.find().sort('id', ASCENDING)
    for m in methods:
        result.append(m)
    return json.dumps(result, default=str)


@app.route('/shipping_method', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def delete_shipping_method():
    data = request.json
    db.shipping_method.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)

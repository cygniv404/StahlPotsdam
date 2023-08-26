import json
import logging

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb.stahlpotsdam


@app.route('/supplier', methods=['GET'])
@jwt_required()
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

    filtered_result = _filter(result, filter_word, filter_operator, filter_column)
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/supplier/<string:supplier_id>/prev', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def update_supplier(supplier_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.suppliers.update_one({'id': supplier_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": supplier_id}, default=str)


@app.route('/supplier', methods=['DELETE'])
@jwt_required()
def delete_supplier():
    data = request.json
    db.suppliers.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/supplier/<int:supplier_id>', methods=['GET'])
@jwt_required()
def get_supplier(supplier_id):
    supplier = db.suppliers.find_one({"id": supplier_id})
    return json.dumps(supplier, default=str) if supplier is not None else jsonify({})

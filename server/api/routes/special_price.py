import json

from flask import g, current_app as app, request
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING

from api._helpers import _filter, _sort

db = g.mongodb.stahlpotsdam


@app.route('/client_special_price/<string:collection>', methods=['POST'])
@jwt_required()
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
@jwt_required()
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

    filtered_result = _filter(result, filter_word, filter_operator, filter_column)
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/client_article_special_price/<int:price_id>', methods=['POST'])
@jwt_required()
def update_article_special_price(price_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.client_article_special_price.update_one({'id': price_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": price_id}, default=str)


@app.route('/client_article_special_price', methods=['DELETE'])
@jwt_required()
def delete_article_special_price():
    data = request.json
    db.client_article_special_price.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


#   client_article_group_special_price
@app.route('/client_article_group_special_price', methods=['GET'])
@jwt_required()
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

    filtered_result = _filter(result, filter_word, filter_operator, filter_column)
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/client_article_group_special_price/<int:price_id>', methods=['POST'])
@jwt_required()
def update_article_group_special_price(price_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.client_article_group_special_price.update_one({'id': price_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": price_id}, default=str)


@app.route('/client_article_group_special_price', methods=['DELETE'])
@jwt_required()
def delete_article_group_special_price():
    data = request.json
    db.client_article_group_special_price.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)

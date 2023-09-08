import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb.stahlpotsdam


@app.route('/article_groups', methods=['GET'])
@jwt_required()
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

    filtered_result = _filter(result, filter_word, filter_operator, filter_column)
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else filtered_result
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/article_groups/<string:article_group_id>', methods=['POST'])
@jwt_required()
def update_article_group(article_group_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.article_groups.update_one({'id': article_group_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": article_group_id}, default=str)


@app.route('/article_groups', methods=['DELETE'])
@jwt_required()
def delete_article_group():
    data = request.json
    db.article_groups.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/article_groups/<string:article_group_id>', methods=['GET'])
@jwt_required()
def get_article_group(article_group_id):
    article_group = db.article_groups.find_one({"id": article_group_id})
    return json.dumps(article_group, default=str) if article_group is not None else jsonify({})


@app.route('/article_groups/<string:article_group_id>/prev', methods=['GET'])
@jwt_required()
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
@jwt_required()
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

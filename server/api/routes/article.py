import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

from api._helpers import _filter, _sort

db = g.mongodb


@app.route('/article', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def create_article():
    new_article = request.json
    db.articles.insert_one(new_article)
    return json.dumps({"id": new_article['id']}, default=str)


@app.route('/article/<string:article_id>', methods=['POST'])
@jwt_required()
def update_article(article_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.articles.update_one({'id': article_id.replace('_', '/')}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": article_id}, default=str)


@app.route('/article', methods=['DELETE'])
@jwt_required()
def delete_article():
    data = request.json
    db.articles.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)


@app.route('/article/<string:article_id>', methods=['GET'])
@jwt_required()
def get_article(article_id):
    article = db.articles.find_one({"id": {'$regex': f'^{article_id.replace("_", "/")}$', '$options': 'i'}})
    return json.dumps(article, default=str) if article is not None else jsonify({})

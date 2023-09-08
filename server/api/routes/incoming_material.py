import json

from flask import g, current_app as app, request
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING

from api._helpers import _filter, _sort

db = g.mongodb.stahlpotsdam


@app.route('/incoming_material', methods=['GET'])
@jwt_required()
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

    filtered_result = _filter(result, filter_word, filter_operator, filter_column)
    sorted_result = sorted(filtered_result,
                           key=lambda el: _sort(el, sort_column),
                           reverse=True if sort_order != 'asc' else False) if sort_column != '' else (
        filtered_result)
    return json.dumps(
        {'rows': sorted_result[page * page_size:(page + 1) * page_size],
         'count': len(sorted_result)}, default=str)


@app.route('/incoming_material', methods=['POST'])
@jwt_required()
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
                           {'$set': {'stock': new_article_stock,
                                     'purchase_price': new_article_purchase_price
                                     }})
    db.incoming_materials.insert_one(new_material)
    return json.dumps({"id": new_material['id']}, default=str)


@app.route('/incoming_material/<int:material_id>', methods=['POST'])
@jwt_required()
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
@jwt_required()
def delete_material():
    data = request.json
    db.incoming_materials.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)

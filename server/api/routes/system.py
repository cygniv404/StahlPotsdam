import json
from flask import g, current_app as app
from flask_jwt_extended import jwt_required
from pymongo import ASCENDING

db = g.mongodb.stahlpotsdam


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

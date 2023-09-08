import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING, ASCENDING

db = g.mongodb.stahlpotsdam


@app.route('/offer/<int:offer_id>', methods=['GET'])
@jwt_required()
def get_offer(offer_id):
    article = db.offers.find_one({"id": offer_id})
    return json.dumps(article, default=str) if article is not None else jsonify({})


@app.route('/offer/<int:offer_id>', methods=['POST'])
@jwt_required()
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
        if db.offers.find_one({"id": offer_id}) is not None:
            # update
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def save_offer_mat_correction(offer_id):
    data = request.json
    mat_correction = {
        'offer_id': int(offer_id),
        'mat': data['matCorrection'],
    }
    db.mat_correction.insert_one(mat_correction)
    return jsonify({'id': offer_id}), 200

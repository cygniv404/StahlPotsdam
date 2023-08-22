import json

from flask import g, current_app as app, request
from flask_jwt_extended import jwt_required
from pymongo import DESCENDING

from api._helpers import _filter, _sort

db = g.mongodb


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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def update_incoming_invoice(invoice_id):
    data = request.json
    field = data['field']
    value = data['value']
    result = db.incoming_invoices.update_one({'id': invoice_id}, {'$set': {field: value}})
    if result.modified_count > 0:
        return json.dumps({"id": invoice_id}, default=str)


@app.route('/incoming_invoices/pay/<int:invoice_id>', methods=['POST'])
@jwt_required()
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
@jwt_required()
def delete_incoming_invoices():
    data = request.json
    db.incoming_invoices.delete_many({"id": {'$in': data['ids']}})
    return json.dumps({"id": data['ids']}, default=str)

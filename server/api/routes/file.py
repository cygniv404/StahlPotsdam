import json

from bson import ObjectId
from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required

db = g.mongodb.stahlpotsdam


@app.route('/files', methods=['POST'])
@jwt_required()
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
@jwt_required()
def get_file(file_id):
    result = db.files.find_one(ObjectId(file_id))
    return json.dumps(result, default=str) if result is not None else jsonify({})


@app.route('/files/<string:file_id>', methods=['DELETE'])
@jwt_required()
def delete_file(file_id):
    data = request.json
    db_collection = data['viewer']
    document_id = data['documentId']
    if document_id and db_collection:
        db[db_collection].update_one({'id': document_id}, {'$set': {'file_id': None}})
    result = db.files.delete_one({'_id': ObjectId(file_id)})
    return json.dumps({'id': file_id}, default=str) if result.deleted_count == 1 else jsonify({})

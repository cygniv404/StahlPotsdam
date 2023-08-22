import json

from flask import g, current_app as app, request, jsonify
from flask_jwt_extended import jwt_required

db = g.mongodb


# DATAGRID COLUMN VISIBILITY
@app.route('/dataGrid_column_visibility/<string:viewer_id>', methods=['POST'])
@jwt_required()
def update_dataGrid_column_visibility(viewer_id):
    grid = db.dataGrid_column_visibility.find_one({'id': viewer_id})
    grid_visibility = request.json
    if grid is None:
        new_grid = {
            'id': viewer_id,
            'columns_visibility': grid_visibility
        }
        result = db.dataGrid_column_visibility.insert_one(new_grid)
        return json.dumps({'id': result.inserted_id}, default=str) if result.inserted_id is not None else jsonify({})

    else:
        result = db.dataGrid_column_visibility.update_one({'id': viewer_id},
                                                          {'$set': {'columns_visibility': grid_visibility}})
        return json.dumps({'id': result.matched_count}, default=str) if result.matched_count is not None else jsonify(
            {})


@app.route('/dataGrid_column_visibility/<string:viewer_id>', methods=['GET'])
@jwt_required()
def get_dataGrid_column_visibility(viewer_id):
    grid = db.dataGrid_column_visibility.find_one({'id': viewer_id})
    return json.dumps({'columns_visibility': grid['columns_visibility']},
                      default=str) if grid is not None else jsonify({})

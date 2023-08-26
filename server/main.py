import logging

from flask_cors import CORS
from flask import g
from app import create_app
from database import init_db

logging.basicConfig(filename='logs/debug.log', level=logging.INFO,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')

app = create_app()
CORS(app)

with (app.app_context()):
    if not hasattr(g, 'mongodb'):
        g.mongodb = init_db()
    from api.routes import article, article_group, bend_type, client, cost_center, datagrid, file, incoming_invoice, \
        incoming_material, offer, offer_position, order, order_position, postition, shipping_methods, special_price, \
        supplier, system, user

if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

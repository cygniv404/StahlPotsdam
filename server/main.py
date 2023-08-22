import logging
from app import app

logging.basicConfig(filename='logs/debug.log', level=logging.INFO,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')


if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

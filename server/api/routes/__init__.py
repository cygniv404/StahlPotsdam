from flask import g, current_app as app


@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'mongodb'):
        g.mongodb.close()

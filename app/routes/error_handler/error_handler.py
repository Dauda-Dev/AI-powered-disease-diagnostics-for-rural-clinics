# error_handlers.py
from flask import jsonify
from werkzeug.exceptions import HTTPException

def register_error_handlers(app):
    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = e.get_response()
        response.data = jsonify({
            "error": e.description,
            "code": e.code
        }).data
        response.content_type = "application/json"
        return response

    @app.errorhandler(Exception)
    def handle_exception(e):
        # For non-HTTP exceptions
        return jsonify({
            "error": "An internal server error occurred.",
            "details": str(e)
        }), 500

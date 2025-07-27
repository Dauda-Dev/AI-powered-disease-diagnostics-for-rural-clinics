from app.services.map_service import getAmenityInfo
from app.models import User, Business
from app import db
from app.utils.jwt_helper import decode_token, generate_token
import jwt
from flask import Blueprint, request, jsonify, abort
from werkzeug.exceptions import BadRequest, Unauthorized

map_bp = Blueprint('map', __name__, url_prefix='/api/v1/map')

def validate_access_token(token=''):
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        raise Unauthorized('Authorization header required')

@map_bp.route('/amenities', methods=['GET'])
def get_hospitals():
    token = request.headers.get('Authorization')
    validate_access_token(token)
    try:
        latitude = float(request.args.get('lat'))
        longitude = float(request.args.get('lng'))
        radius = int(request.args.get('radius'))
        if not latitude or not longitude or not radius:
            raise BadRequest('lat, lng, radius cannot be missing')
        
        hospitals = getAmenityInfo(latitude, longitude, radius)
        return jsonify({
            'message': 'retrieved markers',
            'data': hospitals
        }), 200
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Error retrieving hospitals: {e}")
        return jsonify({'error': 'we encountered an error'}), 500
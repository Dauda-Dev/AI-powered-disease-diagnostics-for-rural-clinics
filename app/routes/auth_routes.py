from flask import Blueprint, request, jsonify
from app.services.auth_service import create_user, authenticate_user, update_profile, create_business_profile, addEmployee
from app.models import User, Business
from app import db
from app.utils.jwt_helper import decode_token, generate_token
import jwt

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')  # Default role is 'user'

    if not password or (not email and not mobile):
        return jsonify({'error': 'Email or mobile and password required'}), 400

    if not role:
        return jsonify({'error': 'Role required'}), 400
    if email and User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 400
    
    user = create_user(email,  password, role)
    token , refresh = authenticate_user(email, password, role)
    return jsonify({'token': token, 'refresh' : refresh, })




@auth_bp.route('/staff', methods=['POST'])
def addStaff():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401
    
    if not token:
        return jsonify({'error': 'Token required'}), 401

    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
        role = payload['role']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    data = request.json
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('role')  # Default role is 'user'
    mobile = data.get('mobile')
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    
    if not password or (not email and not mobile):
        return jsonify({'error': 'Email or mobile and password required'}), 400

    if not role:
        return jsonify({'error': 'Role required'}), 400
    if email and User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already in use'}), 400
    if(role != 'hospital'):
        return jsonify({'error': 'Only hospital staff can be added'}), 400
    business = Business.query.filter_by(user_id=user_id).first()
    if business is None:
        return jsonify({'error': 'Business profile not found'}), 404
    
    user = addEmployee(email=email,  password=password, role='hospital', first_name=first_name, last_name=last_name, mobile=mobile, business_id=business.id, role_level=1, role_name=role_name)
    token , refresh = authenticate_user(email, password, role)
    return jsonify({'token': token, 'refresh' : refresh, })


@auth_bp.route('/staff', methods=['GET'])
def get_staff():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401

    try:
        payload = decode_token(token)
        user_id = payload['user_id']
        role = payload['role']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401

    # Only allow hospital role to access staff list (adjust as needed)
    if role != 'hospital':
        return jsonify({'error': 'Unauthorized access'}), 403

    # Find business associated with this user
    # business = Business.query.filter_by(user_id=user_id).first()
    current_user = User.query.get(user_id)

    # Query all staff linked to this business
    staff_list = User.query.filter_by(business_id=current_user.business_id).all()

    # Format staff data for JSON response
    result = []
    for staff in staff_list:
        result.append({
            'id': staff.id,
            'email': staff.email,
            'mobile': staff.mobile,
            'firstName': staff.first_name,
            'lastName': staff.last_name,
            'role': staff.role,
            'roleName': staff.role_name,
            'staffLevel': staff.role_level
        })

    return jsonify({'staff': result}), 200


@auth_bp.route('/profile', methods=['POST'])
def updateProfile():
    data = request.json
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401

    
    mobile = data.get('mobile')
   
    
    if not token:
        return jsonify({'error': 'Token required'}), 401

    try:
        payload = decode_token(token)
        print(payload)
        user_id = payload['user_id']
        role = payload['role']
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401
    if role == "patient":
        first_name = data.get("firstName")
        last_name = data.get("lastName")
        user = update_profile(user_id, first_name, last_name, mobile)
    if role == "hospital":
        business_name = data.get('businessName')
        business_address = data.get('businessAddress')
        business = create_business_profile(user_id=user_id, mobile=mobile, business_name=business_name, business_address=business_address)
        update_user_with_business = User.query.get(user_id)
        if update_user_with_business:
            update_user_with_business.business_id = business.id
            db.session.commit()
    return jsonify({'message': 'Profile updated successfully'})


@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.json
    email_or_mobile = data.get('email') or data.get('mobile')
    password = data.get('password')
    role = data.get('role', 'patient')  # Default role is 'patient'

    if not email_or_mobile or not password:
        return jsonify({'error': 'Credentials required'}), 400

    token , refresh = authenticate_user(email_or_mobile, password, role)
    if not token:
        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'token': token, 'refresh' : refresh, })

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    data = request.json
    refresh_token = data.get('refresh')

    try:
        payload = decode_token(refresh_token)
        new_token, _ = generate_token(payload['user_id'], payload['role'])
        return jsonify({'token': new_token})
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Refresh token expired'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Invalid token'}), 401




@auth_bp.route('/profile', methods=['GET'])
def get_profile():
    token = request.headers.get('Authorization')
    if token and token.startswith('Bearer '):
        token = token.split(' ')[1]
    else:
        return jsonify({'error': 'Authorization header required'}), 401

    try:
        payload = decode_token(token)
        user_id = payload['user_id']
        role = payload['role']
    except Exception as e:
        return jsonify({'error': f'Token error: {str(e)}'}), 401

    if role == "patient":
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404

        return jsonify({
            'id': user.id,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'mobile': user.mobile,
            'email': user.email,
            'role': user.role,
            'dateOfBirth': user.date_of_birth.strftime('%Y-%m-%d') if user.date_of_birth else None,
            'userStatus': user.user_status,
            'createdAt': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        }), 200

    elif role == "hospital":
        business = Business.query.filter_by(user_id=user_id).first()
        business_user = User.query.get(business.user_id)
        if not business:
            return jsonify({'error': 'Business profile not found'}), 404

        return jsonify({
            'id': business.id,
            'userId': business.user_id,
            'businessName': business.business_name,
            'businessAddress': business.business_address,
            'email': business_user.email if business_user else None,
            'mobile': business.mobile,
        }), 200

    return jsonify({'error': 'Invalid role'}), 400



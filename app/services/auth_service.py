from app.models import User, Business
from app import db, bcrypt
from app.utils.jwt_helper import generate_token
from sqlalchemy import or_, and_

def create_user(email, password, role):
    if role == 'hospital':
        role_level = 2
    elif role == 'patient':
        role_level = 0
        
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(email=email,  password=hashed, role=role, user_status=True, role_level=role_level)
    db.session.add(user)
    db.session.commit()
    return user

def addEmployee(email, password, role, first_name=None, last_name=None, mobile=None, business_id=None, role_level=None, role_name=None):
    if not email or not password or not role:
        raise ValueError("Email, password, and role are required.")
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(
        email=email,
        password=hashed,
        role=role,
        first_name=first_name,
        last_name=last_name,
        mobile=mobile,
        user_status=True,
        business_id=business_id,
        role_level=role_level,
        role_name=role_name
    )
    db.session.add(user)
    db.session.commit()
    return user

def authenticate_user(email_or_mobile, password, role):
    print(f'user role {role}')
    user = User.query.filter(
        and_(
            or_(
                User.email == email_or_mobile,
                User.mobile == email_or_mobile
            ),
            User.role == role
        )
    ).first()
    print(f'user: {user.password} {user.email} {user.mobile} {user.role} {user.id}')
    if user and bcrypt.check_password_hash(user.password, password):
        print ('checking password...')
        return generate_token(user.id, user.role)
    return None

def update_profile(user_id, first_name, last_name, mobile):
    user = User.query.get(user_id)
    if not user:
        return None
    
    if first_name:
        user.first_name = first_name
    if last_name:
        user.last_name = last_name
    if mobile:
        user.mobile = mobile

    db.session.commit()
    return user

def create_business_profile(user_id, business_name, business_address, mobile):
    business = Business(
        business_name=business_name,
        business_address=business_address,
        user_id=user_id,
        mobile=mobile,
        business_status=True
    )
    db.session.add(business)
    db.session.commit()
    return business
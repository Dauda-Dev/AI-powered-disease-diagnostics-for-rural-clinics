import jwt
from datetime import datetime, timedelta
from flask import current_app

def generate_token(user_id, role):
    access_token = jwt.encode({
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, current_app.config['JWT_SECRET'], algorithm='HS256')
    
    refresh_token = jwt.encode({
        'user_id': user_id,
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }, current_app.config['JWT_SECRET'], algorithm='HS256')
    print (f"Access Token: {access_token} Refresh Token: {refresh_token}")
    return access_token, refresh_token
    

def decode_token(token):
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    
    


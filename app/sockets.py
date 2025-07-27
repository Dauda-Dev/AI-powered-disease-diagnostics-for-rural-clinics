# from flask import Blueprint
# from flask_socketio import emit
# from . import socketio

# socketio_bp = Blueprint("socketio_bp", __name__)

# @socketio.on('connect')
# def handle_connect():
#     print("Client connected")
#     emit('message', {'data': 'Connected to WebSocket server'})

# @socketio.on('disconnect')
# def handle_disconnect():
#     print("Client disconnected")

# @socketio.on('recommendation')
# def handle_chat_message(message):
#     print(f"Received message: {message}")
#     emit('recommendation', {'data': message}, broadcast=True)

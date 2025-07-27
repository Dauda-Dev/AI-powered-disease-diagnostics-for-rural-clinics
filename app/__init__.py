# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# from flask_bcrypt import Bcrypt
# from flask_cors import CORS
# from flask_socketio import SocketIO
# from .config import Config
# from flask_apscheduler import APScheduler


# scheduler = APScheduler()
# db = SQLAlchemy()
# bcrypt = Bcrypt()
# socketio = SocketIO(cors_allowed_origins="*")  # Add CORS if needed


# def create_app():
    
#     app = Flask(__name__)
#     app.config.from_object(Config)
#     CORS(app)

#     db.init_app(app)
#     bcrypt.init_app(app)
#     socketio.init_app(app)  # Initialize SocketIO with Flask app

#     from .routes.transcribe_routes import transcribe_bp
#     from .routes.auth_routes import auth_bp 
#     from .routes.hospital_routes import hospital_bp
#     from .sockets import socketio_bp  # Import the WebSocket blueprint
#     from .jobs.process_completed_appointments import process_completed_appointments
    
    
#     app.register_blueprint(auth_bp)
#     app.register_blueprint(hospital_bp)
#     app.register_blueprint(transcribe_bp)
#     app.register_blueprint(socketio_bp)  # Register the socket blueprint
    
#      # Schedule the job here
#     from app.jobs.process_completed_appointments import process_completed_appointments
    
#     def run_recommendation_job(app):
#         with app.app_context():
#             process_completed_appointments(app.config['GROQ_API_KEY'])

    
#     scheduler.init_app(app)
#     scheduler.start()
    
#     # Schedule the recommendation job
#     scheduler.add_job(
#         id='generate_recommendations',
#         func=lambda: run_recommendation_job(app),
#         trigger='interval',
#         seconds=10  # change as needed
#     )
    
#     return app


from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from .config import Config
from flask_apscheduler import APScheduler

db = SQLAlchemy()
bcrypt = Bcrypt()
scheduler = APScheduler()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    db.init_app(app)
    bcrypt.init_app(app)

    from .routes.transcribe_routes import transcribe_bp
    from .routes.auth_routes import auth_bp 
    from .routes.hospital_routes import hospital_bp
    from .routes.map_routes import map_bp
    from .jobs.process_completed_appointments import process_completed_appointments
    from .routes.error_handler.error_handler import register_error_handlers
    
    register_error_handlers(app)
    app.register_blueprint(auth_bp)
    app.register_blueprint(hospital_bp)
    app.register_blueprint(transcribe_bp)
    app.register_blueprint(map_bp)
    

    def run_recommendation_job(app):
        with app.app_context():
            process_completed_appointments(app.config['GROQ_API_KEY'])

    scheduler.init_app(app)
    scheduler.start()

    # scheduler.add_job(
    #     id='generate_recommendations',
    #     func=lambda: run_recommendation_job(app),
    #     trigger='interval',
    #     seconds=10
    # )

    return app

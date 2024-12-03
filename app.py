from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from models import db
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)

    CORS(app)

    with app.app_context():
        db.create_all()
        migrate.init_app(app, db)

    # from routes import auth, students, grades
    # app.register_blueprint(auth.bp)
    # app.register_blueprint(students.bp)
    # app.register_blueprint(grades.bp)

    @app.route('/')
    def home():
        return jsonify({'message': 'Welcome to the Student Management System!'})
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
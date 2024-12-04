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

    from routes import users, teachers, students

    app.register_blueprint(users.auth_bp, url_prefix='/api')
    app.register_blueprint(teachers.teacher_bp, url_prefix='/api')
    app.register_blueprint(students.student_bp, url_prefix='/api')
    

    @app.route('/')
    def list_routes():
        routes = []
        for rule in app.url_map.iter_rules():
            if rule.endpoint != 'static':
                routes.append({
                    'endpoint': rule.endpoint,
                    'methods': list(rule.methods),
                    'url': rule.rule
                })
        return jsonify(routes)
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
from datetime import datetime
from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Teacher

teacher_bp = Blueprint('teacher_api', __name__)
api = Api(teacher_bp)

teacher_parser = reqparse.RequestParser()
teacher_parser.add_argument("user_id", type=int, required=True, help="User ID is required")
teacher_parser.add_argument("class_id", type=int, required=False, help="Class ID (Optional)")
teacher_parser.add_argument("first_name", type=str, required=True, help="First name is required")
teacher_parser.add_argument("last_name", type=str, required=True, help="Last name is required")
teacher_parser.add_argument("gender", type=str, required=True, help="Gender is required")
teacher_parser.add_argument("phone_number", type=str, required=False)
teacher_parser.add_argument("date_of_birth")

teacher_fields = {
    'teacher_id': fields.Integer,
    'user_id': fields.Integer,
    'class_id': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'gender': fields.String,
    'phone_number': fields.String,
    'date_of_birth': fields.String
}

class TeacherResource(Resource):
    @marshal_with(teacher_fields)
    def get(self, teacher_id):
        """Get a specific teacher by ID"""
        teacher = Teacher.query.get(teacher_id)
        if not teacher:
            return {"message": "Teacher not found"}, 404
        return teacher

    @marshal_with(teacher_fields)
    def put(self, teacher_id):
        """Update a teacher"""
        args = teacher_parser.parse_args()
        teacher = Teacher.query.get(teacher_id)
        if not teacher:
            return {"message": "Teacher not found"}, 404
        teacher.user_id = args['user_id']
        teacher.first_name = args['first_name']
        teacher.last_name = args['last_name']
        db.session.commit()
        return teacher, 200

    def delete(self, teacher_id):
        """Delete a teacher"""
        teacher = Teacher.query.get(teacher_id)
        if not teacher:
            return {"message": "Teacher not found"}, 404
        db.session.delete(teacher)
        db.session.commit()
        return {"message": "Teacher deleted"}, 200


class TeacherListResource(Resource):
    @marshal_with(teacher_fields)
    def get(self):
        """Get all teachers"""
        teachers = Teacher.query.all()
        return teachers

    @marshal_with(teacher_fields)
    def post(self):
        """Create a new teacher"""
        args = teacher_parser.parse_args()
        
        # Convert the date_of_birth string to a datetime.date object
        date_of_birth = datetime.strptime(args['date_of_birth'], "%Y-%m-%d").date()
        
        new_teacher = Teacher(
            user_id=args['user_id'],
            class_id=args['class_id'], 
            first_name=args['first_name'], 
            last_name=args['last_name'],
            gender=args['gender'],
            phone_number=args['phone_number'],
            date_of_birth=date_of_birth  # Pass the converted date object
        )
        db.session.add(new_teacher)
        db.session.commit()
        return new_teacher, 201

api.add_resource(TeacherListResource, '/teachers')
api.add_resource(TeacherResource, '/teachers/<int:teacher_id>')

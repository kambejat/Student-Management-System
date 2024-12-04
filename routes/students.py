from flask import Blueprint, jsonify
from flask_restful import Resource, Api, reqparse, fields, marshal_with
from models import db, Student, User, Classes

# Define a Blueprint for students
student_bp = Blueprint('students', __name__)
api = Api(student_bp)

# Define parser for student creation and update
student_parser = reqparse.RequestParser()
student_parser.add_argument("user_id", type=int, required=True, help="User ID is required")
student_parser.add_argument("first_name", type=str, required=True, help="First name is required")
student_parser.add_argument("last_name", type=str, required=True, help="Last name is required")
student_parser.add_argument("date_of_birth", type=str, required=True, help="Date of birth is required (YYYY-MM-DD)")
student_parser.add_argument("enrollment_year", type=str, required=True, help="Enrollment year is required (YYYY-MM-DD)")
student_parser.add_argument("grade_level", type=str, choices=['F1', 'F2', 'F3', 'F4'], required=True, help="Grade level must be F1, F2, F3, or F4")
student_parser.add_argument("class_id", type=int, required=True, help="Class ID is required")

# Define fields for marshaling the response
student_fields = {
    'student_id': fields.Integer,
    'user_id': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'date_of_birth': fields.String,
    'enrollment_year': fields.String,
    'grade_level': fields.String,
    'class_id': fields.Integer,
}


class StudentResource(Resource):
    @marshal_with(student_fields)
    def get(self, student_id):
        """Get a specific student by ID"""
        student = Student.query.get(student_id)
        if not student:
            return {"message": "Student not found"}, 404
        return student

    @marshal_with(student_fields)
    def put(self, student_id):
        """Update a student's details"""
        args = student_parser.parse_args()
        student = Student.query.get(student_id)
        if not student:
            return {"message": "Student not found"}, 404

        student.user_id = args['user_id']
        student.first_name = args['first_name']
        student.last_name = args['last_name']
        student.date_of_birth = args['date_of_birth']
        student.enrollment_year = args['enrollment_year']
        student.grade_level = args['grade_level']
        student.class_id = args['class_id']

        db.session.commit()
        return student, 200

    def delete(self, student_id):
        """Delete a student"""
        student = Student.query.get(student_id)
        if not student:
            return {"message": "Student not found"}, 404

        db.session.delete(student)
        db.session.commit()
        return {"message": "Student deleted successfully"}, 200


class StudentListResource(Resource):
    @marshal_with(student_fields)
    def get(self):
        """Get all students"""
        students = Student.query.all()
        return students

    @marshal_with(student_fields)
    def post(self):
        """Create a new student"""
        args = student_parser.parse_args()

        # Check if the user exists
        user = User.query.get(args['user_id'])
        if not user:
            return {"message": "User not found"}, 404

        # Check if the class exists
        class_ = Classes.query.get(args['class_id'])
        if not class_:
            return {"message": "Class not found"}, 404

        new_student = Student(
            user_id=args['user_id'],
            first_name=args['first_name'],
            last_name=args['last_name'],
            date_of_birth=args['date_of_birth'],
            enrollment_year=args['enrollment_year'],
            grade_level=args['grade_level'],
            class_id=args['class_id']
        )

        db.session.add(new_student)
        db.session.commit()
        return new_student, 201


# Add resources to API
api.add_resource(StudentListResource, '/students')
api.add_resource(StudentResource, '/students/<int:student_id>')

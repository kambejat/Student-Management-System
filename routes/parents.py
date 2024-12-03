from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with
from models import db, Parent, ParentStudent, Student, User
from flask_restful import Resource, Api, reqparse, fields, marshal_with

parent_bp = Blueprint("parents", __name__)
api = Api(parent_bp)

# Define parsers
parent_parser = reqparse.RequestParser()
parent_parser.add_argument("user_id", type=int, required=True, help="User ID is required")
parent_parser.add_argument("first_name", type=str, required=True, help="First name is required")
parent_parser.add_argument("last_name", type=str, required=True, help="Last name is required")
parent_parser.add_argument("phone_number", type=str, required=False, help="Phone number is optional")

parent_student_parser = reqparse.RequestParser()
parent_student_parser.add_argument("parent_id", type=int, required=True, help="Parent ID is required")
parent_student_parser.add_argument("student_id", type=int, required=True, help="Student ID is required")

# Define fields for marshaling
parent_fields = {
    'parent_id': fields.Integer,
    'user_id': fields.Integer,
    'first_name': fields.String,
    'last_name': fields.String,
    'phone_number': fields.String,
}

parent_student_fields = {
    'parent_id': fields.Integer,
    'student_id': fields.Integer,
}


class ParentResource(Resource):
    @marshal_with(parent_fields)
    def get(self, parent_id):
        """Get a specific parent by ID"""
        parent = Parent.query.get(parent_id)
        if not parent:
            return {"message": "Parent not found"}, 404
        return parent

    @marshal_with(parent_fields)
    def put(self, parent_id):
        """Update a parent's details"""
        args = parent_parser.parse_args()
        parent = Parent.query.get(parent_id)
        if not parent:
            return {"message": "Parent not found"}, 404

        parent.user_id = args['user_id']
        parent.first_name = args['first_name']
        parent.last_name = args['last_name']
        parent.phone_number = args['phone_number']

        db.session.commit()
        return parent, 200

    def delete(self, parent_id):
        """Delete a parent"""
        parent = Parent.query.get(parent_id)
        if not parent:
            return {"message": "Parent not found"}, 404

        db.session.delete(parent)
        db.session.commit()
        return {"message": "Parent deleted successfully"}, 200


class ParentListResource(Resource):
    @marshal_with(parent_fields)
    def get(self):
        """Get all parents"""
        parents = Parent.query.all()
        return parents

    @marshal_with(parent_fields)
    def post(self):
        """Create a new parent"""
        args = parent_parser.parse_args()

        # Check if the user exists
        user = User.query.get(args['user_id'])
        if not user:
            return {"message": "User not found"}, 404

        new_parent = Parent(
            user_id=args['user_id'],
            first_name=args['first_name'],
            last_name=args['last_name'],
            phone_number=args.get('phone_number')
        )

        db.session.add(new_parent)
        db.session.commit()
        return new_parent, 201


class ParentStudentResource(Resource):
    @marshal_with(parent_student_fields)
    def post(self):
        """Link a parent to a student"""
        args = parent_student_parser.parse_args()

        # Check if the parent exists
        parent = Parent.query.get(args['parent_id'])
        if not parent:
            return {"message": "Parent not found"}, 404

        # Check if the student exists
        student = Student.query.get(args['student_id'])
        if not student:
            return {"message": "Student not found"}, 404

        # Check if the relationship already exists
        existing_link = ParentStudent.query.filter_by(
            parent_id=args['parent_id'],
            student_id=args['student_id']
        ).first()
        if existing_link:
            return {"message": "Link already exists"}, 400

        new_link = ParentStudent(parent_id=args['parent_id'], student_id=args['student_id'])
        db.session.add(new_link)
        db.session.commit()
        return new_link, 201

    def delete(self):
        """Unlink a parent from a student"""
        args = parent_student_parser.parse_args()

        # Check if the relationship exists
        link = ParentStudent.query.filter_by(
            parent_id=args['parent_id'],
            student_id=args['student_id']
        ).first()
        if not link:
            return {"message": "Link not found"}, 404

        db.session.delete(link)
        db.session.commit()
        return {"message": "Link deleted successfully"}, 200


# Add resources to API
api.add_resource(ParentListResource, '/parents')
api.add_resource(ParentResource, '/parents/<int:parent_id>')
api.add_resource(ParentStudentResource, '/parent-student')

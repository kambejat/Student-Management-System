from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Classes

classes_bp = Blueprint()
api = Api(classes_bp)

classes_parser = reqparse.RequestParser()
classes_parser.add_argument("name", type=str, required=True, help="Class name is required")
classes_parser.add_argument("subject_id", type=int, required=True, help="Subject ID is required")
classes_parser.add_argument("teacher_id", type=int, required=True, help="Teacher ID is required")
classes_parser.add_argument("schedule_time", type=str, required=True, help="Schedule time is required (HH:MM:SS format)")

classes_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'subject_id': fields.Integer,
    'teacher_id': fields.Integer,
    'schedule_time': fields.String,
}

class ClassesResource(Resource):
    @marshal_with(classes_fields)
    def get(self, class_id):
        """Get a specific class by ID"""
        class_ = Classes.query.get(class_id)
        if not class_:
            return {"message": "Class not found"}, 404
        return class_

    @marshal_with(classes_fields)
    def put(self, class_id):
        """Update a class"""
        args = classes_parser.parse_args()
        class_ = Classes.query.get(class_id)
        if not class_:
            return {"message": "Class not found"}, 404
        class_.name = args['name']
        class_.subject_id = args['subject_id']
        class_.teacher_id = args['teacher_id']
        class_.schedule_time = args['schedule_time']
        db.session.commit()
        return class_, 200

    def delete(self, class_id):
        """Delete a class"""
        class_ = Classes.query.get(class_id)
        if not class_:
            return {"message": "Class not found"}, 404
        db.session.delete(class_)
        db.session.commit()
        return {"message": "Class deleted"}, 200


class ClassesListResource(Resource):
    @marshal_with(classes_fields)
    def get(self):
        """Get all classes"""
        classes = Classes.query.all()
        return classes

    @marshal_with(classes_fields)
    def post(self):
        """Create a new class"""
        args = classes_parser.parse_args()
        new_class = Classes(
            name=args['name'], 
            subject_id=args['subject_id'], 
            teacher_id=args['teacher_id'], 
            schedule_time=args['schedule_time']
        )
        db.session.add(new_class)
        db.session.commit()
        return new_class, 201

api.add_resource(ClassesListResource, '/classes')
api.add_resource(ClassesResource, '/classes/<int:class_id>')

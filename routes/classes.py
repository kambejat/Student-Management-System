from datetime import datetime
from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Classes

# Define Blueprint and API
classes_bp = Blueprint("classes", __name__)
api = Api(classes_bp)

# Parser for request data
classes_parser = reqparse.RequestParser()
classes_parser.add_argument("name", type=str, required=True, help="Class name is required")
classes_parser.add_argument("subject_id", type=int, required=False, help="Subject ID is optional")
classes_parser.add_argument("teacher_id", type=int, required=False, help="Teacher ID is optional")
classes_parser.add_argument("schedule_time", type=str, required=False, help="Schedule time is optional (HH:MM:SS format)")

# Fields for response marshalling
classes_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'subject_id': fields.Integer,
    'teacher_id': fields.Integer,
    'schedule_time': fields.String,
}

# Resource for handling a specific class
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
        class_.subject_id = args.get('subject_id')  # Optional
        class_.teacher_id = args.get('teacher_id')  # Optional
        class_.schedule_time = args.get('schedule_time')  # Optional
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

# Resource for handling a list of classes
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
        
        # Convert schedule_time to Python time object
        schedule_time_str = args['schedule_time']  # Assuming input is a string like "14:30"
        schedule_time = None
        if schedule_time_str:
            try:
                # Parse time string to datetime.time
                schedule_time = datetime.strptime(schedule_time_str, "%H:%M").time()
            except ValueError:
                return {"error": "Invalid time format. Use HH:MM format."}, 400

        new_class = Classes(
            name=args['name'], 
            subject_id=args['subject_id'],  # Optional
            teacher_id=args['teacher_id'],  # Optional
            schedule_time=schedule_time  # Set the parsed time
        )
        db.session.add(new_class)
        db.session.commit()
        return new_class, 201

# Add resources to API
api.add_resource(ClassesListResource, '/classes')
api.add_resource(ClassesResource, '/classes/<int:class_id>')

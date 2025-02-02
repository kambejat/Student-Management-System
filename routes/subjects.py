from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Subject

subject_bp = Blueprint("subjects", __name__)
api = Api(subject_bp)

subject_parser = reqparse.RequestParser()
subject_parser.add_argument("name", type=str, required=True, help="Subject name is required")
subject_parser.add_argument("grade_level", type=str, required=True, choices=['F1', 'F2', 'F3', 'F4'], help="Grade level must be one of '1', '2', '3', '4'")
subject_parser.add_argument("teacher", type=str, required=False, help="Teacher name is optional")

subject_fields = {
    'subject_id': fields.Integer,
    'name': fields.String,
    'grade_level': fields.String,
    'teacher': fields.String,
}

class SubjectResource(Resource):
    @marshal_with(subject_fields)
    def get(self, subject_id):
        """Get a specific subject by ID"""
        subject = Subject.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404
        return subject

    @marshal_with(subject_fields)
    def put(self, subject_id):
        """Update a subject"""
        args = subject_parser.parse_args()
        subject = Subject.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404
        subject.name = args['name']
        subject.grade_level = args['grade_level']
        subject.teacher = args['teacher']  # Update the teacher field
        db.session.commit()
        return subject, 200

    def delete(self, subject_id):
        """Delete a subject"""
        subject = Subject.query.get(subject_id)
        if not subject:
            return {"message": "Subject not found"}, 404
        db.session.delete(subject)
        db.session.commit()
        return {"message": "Subject deleted"}, 200


class SubjectListResource(Resource):
    @marshal_with(subject_fields)
    def get(self):
        """Get all subjects"""
        subjects = Subject.query.all()
        return subjects

    @marshal_with(subject_fields)
    def post(self):
        """Create a new subject"""
        args = subject_parser.parse_args()
        new_subject = Subject(name=args['name'], grade_level=args['grade_level'], teacher=args['teacher'])
        db.session.add(new_subject)
        db.session.commit()
        return new_subject, 201

api.add_resource(SubjectListResource, '/subjects')
api.add_resource(SubjectResource, '/subjects/<int:subject_id>')
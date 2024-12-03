from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Result

result_bp = Blueprint('results', __name__)
api = Api(result_bp)

result_parser = reqparse.RequestParser()
result_parser.add_argument("student_id", type=int, required=True, help="Student ID is required")
result_parser.add_argument("subject_id", type=int, required=True, help="Subject ID is required")
result_parser.add_argument("term", type=str, required=True, choices=['Term 1', 'Term 2', 'Term 3'], help="Term must be 'Term 1', 'Term 2', or 'Term 3'")
result_parser.add_argument("grade", type=str, required=True, help="Grade is required")
result_parser.add_argument("exam_date", type=str, required=True, help="Exam date is required (YYYY-MM-DD)")
result_parser.add_argument("remarks", type=str, default="")

result_fields = {
    'result_id': fields.Integer,
    'student_id': fields.Integer,
    'subject_id': fields.Integer,
    'term': fields.String,
    'grade': fields.String,
    'exam_date': fields.String,
    'remarks': fields.String,
}

class ResultResource(Resource):
    @marshal_with(result_fields)
    def get(self, result_id):
        """Get a specific result by ID"""
        result = Result.query.get(result_id)
        if not result:
            return {"message": "Result not found"}, 404
        return result

    @marshal_with(result_fields)
    def put(self, result_id):
        """Update a result"""
        args = result_parser.parse_args()
        result = Result.query.get(result_id)
        if not result:
            return {"message": "Result not found"}, 404
        result.student_id = args['student_id']
        result.subject_id = args['subject_id']
        result.term = args['term']
        result.grade = args['grade']
        result.exam_date = args['exam_date']
        result.remarks = args['remarks']
        db.session.commit()
        return result, 200

    def delete(self, result_id):
        """Delete a result"""
        result = Result.query.get(result_id)
        if not result:
            return {"message": "Result not found"}, 404
        db.session.delete(result)
        db.session.commit()
        return {"message": "Result deleted"}, 200


class ResultListResource(Resource):
    @marshal_with(result_fields)
    def get(self):
        """Get all results"""
        results = Result.query.all()
        return results

    @marshal_with(result_fields)
    def post(self):
        """Create a new result"""
        args = result_parser.parse_args()
        new_result = Result(
            student_id=args['student_id'], 
            subject_id=args['subject_id'], 
            term=args['term'], 
            grade=args['grade'], 
            exam_date=args['exam_date'], 
            remarks=args['remarks']
        )
        db.session.add(new_result)
        db.session.commit()
        return new_result, 201

api.add_resource(ResultListResource, '/results')
api.add_resource(ResultResource, '/results/<int:result_id>')

from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Attendance

attendance_api_bp = Blueprint('attendance_api', __name__)
api = Api(attendance_api_bp)

attendance_parser = reqparse.RequestParser()
attendance_parser.add_argument("student_id", type=int, required=True, help="Student ID is required")
attendance_parser.add_argument("class_id", type=int, required=True, help="Class ID is required")
attendance_parser.add_argument("attendance_date", type=str, required=True, help="Attendance date is required (YYYY-MM-DD)")
attendance_parser.add_argument("status", type=str, required=True, choices=['Present', 'Absent', 'Late'], help="Status must be 'Present', 'Absent', or 'Late'")

attendance_fields = {
    'attendance_id': fields.Integer,
    'student_id': fields.Integer,
    'class_id': fields.Integer,
    'attendance_date': fields.String,
    'status': fields.String,
}

class AttendanceResource(Resource):
    @marshal_with(attendance_fields)
    def get(self, attendance_id):
        """Get a specific attendance record by ID"""
        attendance = Attendance.query.get(attendance_id)
        if not attendance:
            return {"message": "Attendance record not found"}, 404
        return attendance

    @marshal_with(attendance_fields)
    def put(self, attendance_id):
        """Update an attendance record"""
        args = attendance_parser.parse_args()
        attendance = Attendance.query.get(attendance_id)
        if not attendance:
            return {"message": "Attendance record not found"}, 404
        attendance.student_id = args['student_id']
        attendance.class_id = args['class_id']
        attendance.attendance_date = args['attendance_date']
        attendance.status = args['status']
        db.session.commit()
        return attendance, 200

    def delete(self, attendance_id):
        """Delete an attendance record"""
        attendance = Attendance.query.get(attendance_id)
        if not attendance:
            return {"message": "Attendance record not found"}, 404
        db.session.delete(attendance)
        db.session.commit()
        return {"message": "Attendance record deleted"}, 200


class AttendanceListResource(Resource):
    @marshal_with(attendance_fields)
    def get(self):
        """Get all attendance records"""
        attendance_records = Attendance.query.all()
        return attendance_records

    @marshal_with(attendance_fields)
    def post(self):
        """Create a new attendance record"""
        args = attendance_parser.parse_args()
        new_attendance = Attendance(
            student_id=args['student_id'], 
            class_id=args['class_id'], 
            attendance_date=args['attendance_date'], 
            status=args['status']
        )
        db.session.add(new_attendance)
        db.session.commit()
        return new_attendance, 201

api.add_resource(AttendanceListResource, '/attendance')
api.add_resource(AttendanceResource, '/attendance/<int:attendance_id>')

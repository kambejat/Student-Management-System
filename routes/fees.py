from flask import Blueprint, request
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, FeesCollection, Student

# Define the Blueprint
fees_bp = Blueprint("fees", __name__)
api = Api(fees_bp)

# Request Parser for FeesCollection
fees_parser = reqparse.RequestParser()
fees_parser.add_argument("student_id", type=int, required=True, help="Student ID is required")
fees_parser.add_argument("reference_number", type=str, required=True, help="Reference number is required")
fees_parser.add_argument("amount_paid", type=float, required=True, help="Amount paid is required")
fees_parser.add_argument("payment_date", type=str, required=True, help="Payment date is required")
fees_parser.add_argument("payment_method", type=str, required=True, help="Payment method is required")
fees_parser.add_argument("academic_year", type=str, required=True, help="Academic year is required")

# Response Fields
fees_fields = {
    'fee_id': fields.Integer,
    'student_id': fields.Integer,
    'student_name': fields.String(attribute=lambda x: f"{x.student.first_name} {x.student.last_name}" if x.student else None),
    'status': fields.String(attribute=lambda x: "Paid" if x.amount_paid > 0 else "Unpaid"),
    'reference_number': fields.String,
    'amount_paid': fields.Float,
    'payment_date': fields.String,
    'payment_method': fields.String,
    'academic_year': fields.String,
}

# Resource for a Single Fee Entry
class FeeResource(Resource):
    @marshal_with(fees_fields)
    def get(self, fee_id):
        """Get a specific fee entry by ID"""
        fee = FeesCollection.query.options(db.joinedload(FeesCollection.student)).get(fee_id)
        if not fee:
            return {"message": "Fee entry not found"}, 404
        return fee

    @marshal_with(fees_fields)
    def put(self, fee_id):
        """Update a fee entry"""
        args = fees_parser.parse_args()
        fee = FeesCollection.query.get(fee_id)
        if not fee:
            return {"message": "Fee entry not found"}, 404
        fee.student_id = args['student_id']
        fee.reference_number = args['reference_number']
        fee.amount_paid = args['amount_paid']
        fee.payment_date = args['payment_date']
        fee.payment_method = args['payment_method']
        fee.academic_year = args['academic_year']
        db.session.commit()
        return fee, 200

    def delete(self, fee_id):
        """Delete a fee entry"""
        fee = FeesCollection.query.get(fee_id)
        if not fee:
            return {"message": "Fee entry not found"}, 404
        db.session.delete(fee)
        db.session.commit()
        return {"message": "Fee entry deleted"}, 200


# Resource for the List of Fees
class FeeListResource(Resource):
    @marshal_with(fees_fields)
    def get(self):
        """Get all fees with optional filtering by academic year, first name, or last name"""
        academic_year = request.args.get('academic_year')
        first_name = request.args.get('first_name')
        last_name = request.args.get('last_name')

        query = FeesCollection.query.options(db.joinedload(FeesCollection.student))

        if academic_year:
            query = query.filter(FeesCollection.academic_year == academic_year)

        if first_name:
            query = query.filter(Student.first_name.ilike(f"%{first_name}%"))

        if last_name:
            query = query.filter(Student.last_name.ilike(f"%{last_name}%"))

        fees = query.all()
        return fees

    @marshal_with(fees_fields)
    def post(self):
        """Create a new fee entry"""
        args = fees_parser.parse_args()
        new_fee = FeesCollection(
            student_id=args['student_id'],
            reference_number=args['reference_number'],
            amount_paid=args['amount_paid'],
            payment_date=args['payment_date'],
            payment_method=args['payment_method'],
            academic_year=args['academic_year'],
        )
        db.session.add(new_fee)
        db.session.commit()
        return new_fee, 201


# Add Resources to the API
api.add_resource(FeeListResource, '/fees')
api.add_resource(FeeResource, '/fees/<int:fee_id>')

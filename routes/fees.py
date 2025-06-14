from flask import Blueprint, request, jsonify
from flask_restful import reqparse, fields, marshal_with, Resource, Api, marshal
from models import db, FeesCollection, Student, YearlyFees


from datetime import datetime, date

def to_python_date(value):
    if not value:
        return date.today()  # fallback
    try:
        # Remove 'Z', handle ISO format
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt.date()
    except Exception as e:
        print(f"Invalid date: {value}, error: {e}")
        return date.today()

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
        fee = FeesCollection.query.options(db.joinedload(FeesCollection.student)).get(fee_id)
        if not fee:
            return {"message": "Fee entry not found"}, 404
        return fee

    @marshal_with(fees_fields)
    def put(self, fee_id):
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
        return fees, 200

    @marshal_with(fees_fields)
    def post(self):
        args = fees_parser.parse_args()
        new_fee = FeesCollection(
            student_id=args['student_id'],
            reference_number=args['reference_number'],
            amount_paid=args['amount_paid'],
            payment_date=to_python_date(args['payment_date']),
            payment_method=args['payment_method'],
            academic_year=args['academic_year'],
        )
        db.session.add(new_fee)
        db.session.commit()
        return new_fee, 201

# Add Resources to the API
api.add_resource(FeeListResource, '/fees')
api.add_resource(FeeResource, '/fees/<int:fee_id>')

# Additional API: Fees collection with balances
@fees_bp.route('/fees_collection_with_balances', methods=['GET'])
def fees_collection_with_balances():
    grade_level = request.args.get('grade_level')
    if not grade_level:
        return jsonify({"message": "grade_level query parameter is required"}), 400

    students = Student.query.filter_by(grade_level=grade_level).all()
    yearly_fees = YearlyFees.query.filter_by(grade_level=grade_level).all()

    results = []

    for student in students:
        for yf in yearly_fees:
            # Get all fees paid by this student for this academic year
            total_paid = sum(
                f.amount_paid for f in student.fees_collection
                if f.academic_year == yf.academic_year
            )

            balance = yf.fee_amount - total_paid

            results.append({
                "student_id": student.student_id,
                "student_name": f"{student.first_name} {student.last_name}",
                "academic_year": yf.academic_year,
                "grade_level": grade_level,
                "total_fee": yf.fee_amount,
                "total_paid": total_paid,
                "balance": balance
            })

    return jsonify(results)



@fees_bp.route('/import_fees', methods=['POST'])
def import_fees():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No data provided"}), 400

    imported_entries = []
    errors = []

    for idx, item in enumerate(data):
        student_id = item.get('student_id')
        academic_year = item.get('academic_year')
        amount_paid = item.get('amount_paid')
        reference_number = item.get('reference_number') or f"REF-{student_id}-{academic_year}"

        # Skip incomplete rows
        if not all([student_id, academic_year, amount_paid is not None]):
            errors.append({
                "index": idx,
                "reference_number": reference_number,
                "error": "Missing required fields"
            })
            continue
        
        # Check for duplicate reference_number in DB
        existing_fee = FeesCollection.query.filter_by(reference_number=reference_number).first()
        if existing_fee:
            errors.append({
                "index": idx,
                "reference_number": reference_number,
                "error": "Duplicate reference number"
            })
            continue

        new_fee = FeesCollection(
            student_id=student_id,
            reference_number=reference_number,
            amount_paid=amount_paid,
            payment_date=to_python_date(item.get('payment_date')),
            payment_method=item.get('payment_method') or 'Imported',
            academic_year=academic_year,
        )
        db.session.add(new_fee)
        imported_entries.append({
            "student_id": student_id,
            "academic_year": academic_year,
            "amount_paid": amount_paid,
            "reference_number": reference_number
        })

    if imported_entries:
        db.session.commit()

    response = {
        "message": f"{len(imported_entries)} fee entries imported successfully",
        "imported_entries": imported_entries,
    }
    if errors:
        response["errors"] = errors

    return jsonify(response), 201 if imported_entries else 400



yearly_fees_parser = reqparse.RequestParser()
yearly_fees_parser.add_argument('academic_year', type=str, required=True, help='Academic year is required')
yearly_fees_parser.add_argument('grade_level', type=str, required=True, choices=('F1', 'F2', 'F3', 'F4'), help='Grade level is required')
yearly_fees_parser.add_argument('fee_amount', type=float, required=True, help='Fee amount is required')

# Response Fields
yearly_fees_field = {
    'academic_year': fields.String,
    'grade_level': fields.String,
    'fee_amount': fields.Float
}

class YearlyFeesResource(Resource):
    @marshal_with(yearly_fees_field)
    def get(self, fee_id):
        fee = YearlyFees.query.get(fee_id)
        if not fee:
            return {"message": "Yearly fee not found"}, 404
        return fee, 200

    @marshal_with(yearly_fees_field)
    def put(self, fee_id):
        args = yearly_fees_parser.parse_args()
        fee = YearlyFees.query.get(fee_id)
        if not fee:
            return {"message": "Yearly fee not found"}, 404
        fee.academic_year = args['academic_year']
        fee.grade_level = args['grade_level']
        fee.fee_amount = args['fee_amount']
        db.session.commit()
        return fee, 200
    
    @marshal_with(yearly_fees_field)
    def delete(self, fee_id):
        fee = YearlyFees.query.get(fee_id)
        if not fee:
            return {"message": "Yearly fee not found"}, 404
        db.session.delete(fee)
        db.session.commit()
        return {"message": "Deleted successfully"}, 200

class YearlyFeesListResource(Resource):
    @marshal_with(yearly_fees_field)
    def get(self):
        fees = YearlyFees.query.all()
        return fees, 200
    
    def post(self):
        args = yearly_fees_parser.parse_args()

        existing_fee = YearlyFees.query.filter_by(
            academic_year=args['academic_year'],
            grade_level=args['grade_level']
        ).first()

        if existing_fee:
            return {"message": "Yearly fee for this academic year and grade level already exists. Please use PUT to update it."}, 409

        new_fee = YearlyFees(
            academic_year=args['academic_year'],
            grade_level=args['grade_level'],
            fee_amount=args['fee_amount']
        )
        db.session.add(new_fee)
        db.session.commit()
        return marshal(new_fee, yearly_fees_field), 201


api.add_resource(YearlyFeesListResource, '/yearly_fees')
api.add_resource(YearlyFeesResource, '/yearly_fees/<int:fee_id>')
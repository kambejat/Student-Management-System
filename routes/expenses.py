from flask import Blueprint, request
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Expense
from werkzeug.utils import secure_filename
import os
import datetime

# Config
UPLOAD_FOLDER = 'uploads/expenses'
ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png'}

# Blueprint + API
expense_bp = Blueprint('expenses', __name__)
api = Api(expense_bp)

# -------- Helpers --------
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# -------- Request Parser --------
expense_parser = reqparse.RequestParser()
expense_parser.add_argument("expense_type", type=str, required=True, help="Expense type is required")
expense_parser.add_argument("amount", type=float, required=True, help="Amount is required")
expense_parser.add_argument("description", type=str)
expense_parser.add_argument("expense_date", type=str, required=True, help="Expense date is required in YYYY-MM-DD format")

# -------- Output Fields --------
expense_fields = {
    'expense_id': fields.Integer,
    'expense_type': fields.String,
    'amount': fields.Float,
    'description': fields.String,
    'expense_date': fields.String,
    'attachment': fields.String,
    'created_at': fields.String,
}

# -------- Resources --------
class ExpenseListResource(Resource):
    @marshal_with(expense_fields)
    def get(self):
        expenses = Expense.query.order_by(Expense.expense_date.desc()).all()
        return expenses

    @marshal_with(expense_fields)
    def post(self):
        data = request.form
        file = request.files.get('attachment')
        filename = None

        if file and allowed_file(file.filename):
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))

        expense = Expense(
            expense_type=data.get('expense_type'),
            amount=float(data.get('amount')),
            description=data.get('description'),
            expense_date=datetime.datetime.strptime(data.get('expense_date'), "%Y-%m-%d").date(),
            attachment=filename
        )
        db.session.add(expense)
        db.session.commit()
        return expense, 201


class ExpenseResource(Resource):
    @marshal_with(expense_fields)
    def get(self, expense_id):
        expense = Expense.query.get_or_404(expense_id)
        return expense

    @marshal_with(expense_fields)
    def put(self, expense_id):
        expense = Expense.query.get_or_404(expense_id)
        args = expense_parser.parse_args()
        file = request.files.get('attachment')

        expense.expense_type = args['expense_type']
        expense.amount = args['amount']
        expense.description = args.get('description')
        expense.expense_date = datetime.datetime.strptime(args['expense_date'], "%Y-%m-%d").date()

        if file and allowed_file(file.filename):
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            filename = secure_filename(file.filename)
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            expense.attachment = filename

        db.session.commit()
        return expense

    def delete(self, expense_id):
        expense = Expense.query.get_or_404(expense_id)
        db.session.delete(expense)
        db.session.commit()
        return {'message': 'Expense deleted successfully'}

# -------- Register Endpoints --------
api.add_resource(ExpenseListResource, '/expenses')
api.add_resource(ExpenseResource, '/expenses/<int:expense_id>')

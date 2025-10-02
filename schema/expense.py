from flask_marshmallow import Marshmallow
from models import Expense

ma = Marshmallow()

class ExpenseSchema(ma.Schema):
    class Meta:
        model = Expense
        load_instance = True

expense_schema = ExpenseSchema()
expense_schema = ExpenseSchema(many=True)
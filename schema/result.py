from flask_marshmallow import Marshmallow
from models import Result

ma = Marshmallow()

class ResultSchema(ma.Schema):
    class Meta:
        model = Result
        load_instance = True


result_schema = ResultSchema()
results_schema = ResultSchema(many=True)
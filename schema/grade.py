from flask_marshmallow import Marshmallow
from models import Grade

ma =  Marshmallow()

class GradeSchema(ma.Schema):
    class Meta:
        model = Grade
        load_instance = True

grade_schema = GradeSchema()
grades_schema = GradeSchema(many=True)
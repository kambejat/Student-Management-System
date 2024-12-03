from flask_marshmallow import Marshmallow
from models import Subject

ma = Marshmallow()

class SubjectSchema(ma.Schema):
    class Meta:
        model = Subject
        load_instance = True


subject_schema = SubjectSchema()
subjects_schema = SubjectSchema(many=True)
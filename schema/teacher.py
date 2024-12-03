from flask_marshmallow import Marshmallow
from models import Teacher

ma = Marshmallow()

class TeacherSchema(ma.Schema):
    class Meta:
        model = Teacher
        load_instance = True


teacher_schema = TeacherSchema()
teacher_schema_many = TeacherSchema(many=True)
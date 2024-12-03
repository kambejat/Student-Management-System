from flask_marshmallow import Marshmallow
from models import Student

ma = Marshmallow()


class StudentSchema(ma.Schema):
    class Meta:
        model = Student
        load_instance = True


student_schema = StudentSchema()
students_schema = StudentSchema(many=True)
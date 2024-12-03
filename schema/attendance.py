from flask_marshmallow import Marshmallow
from models import Attendance

ma = Marshmallow()

class AttendanceSchema(ma.Schema):
    class Meta:
        model = Attendance
        load_instance = True


attendance_schema = AttendanceSchema()
attendance_list_schema = AttendanceSchema(many=True)
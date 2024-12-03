from flask_marshmallow import Marshmallow
from models import Classes

ma  = Marshmallow()

class ClassSchema(ma.Schema):
    class Meta:
        model = Classes
        load_instance = True


class_schema = ClassSchema()
class_schemas = ClassSchema(many=True)
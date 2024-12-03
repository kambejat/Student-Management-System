from flask_marshmallow import Marshmallow
from models import Parent

ma = Marshmallow()

class ParentSchema(ma.Schema):
    class Meta:
        model = Parent
        load_instance = True


parent_schema = ParentSchema()
parents_schema = ParentSchema(many=True)
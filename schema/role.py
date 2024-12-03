from flask_marshmallow import Marshmallow
from models import Role

ma = Marshmallow()

class RoleSchema(ma.Schema):
    class Meta:
        model = Role
        load_instance = True


role_schema = RoleSchema()
roles_schema = RoleSchema(many=True)
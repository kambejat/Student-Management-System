from flask_marshmallow import Marshmallow
from models import Permission

ma = Marshmallow()

class PermissionSchema(ma.Schema):
    class Meta:
        model = Permission
        load_instance = True


permission_schema = PermissionSchema()
permissions_schema = PermissionSchema(many=True)
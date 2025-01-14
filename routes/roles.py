from flask import Blueprint
from flask_restful import reqparse, fields, marshal_with, Resource, Api
from models import db, Role, Permission, RolePermission, UserRole

role_bp = Blueprint('role', __name__)
api = Api(role_bp)

# Request parsers for input validation
role_parser = reqparse.RequestParser()
role_parser.add_argument('name', type=str, required=True, help='Role name is required')
role_parser.add_argument('description', type=str, required=False, help='Role description')

permission_parser = reqparse.RequestParser()
permission_parser.add_argument('name', type=str, required=True, help='Permission name is required')
permission_parser.add_argument('description', type=str, required=False, help='Permission description')

role_permission_parser = reqparse.RequestParser()
role_permission_parser.add_argument('role_id', type=int, required=True, help='Role ID is required')
role_permission_parser.add_argument('permission_id', type=int, required=True, help='Permission ID is required')

user_role_parser = reqparse.RequestParser()
user_role_parser.add_argument('user_id', type=int, required=True, help='User ID is required')
user_role_parser.add_argument('role_id', type=int, required=True, help='Role ID is required')

# Fields for marshalling response
role_fields = {
    'role_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
}

permission_fields = {
    'permission_id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
}

class RoleResource(Resource):
    @marshal_with(role_fields)
    def get(self, role_id=None):
        if role_id:
            role = Role.query.get(role_id)
            if role:
                return role
            return {'message': 'Role not found'}, 404
        else:
            roles = Role.query.all()
            return roles

    def post(self):
        args = role_parser.parse_args()
        role = Role(name=args['name'], description=args['description'])
        db.session.add(role)
        db.session.commit()
        return {'message': 'Role created', 'role_id': role.role_id}, 201

    def put(self, role_id):
        args = role_parser.parse_args()
        role = Role.query.get(role_id)
        if role:
            role.name = args['name']
            role.description = args['description']
            db.session.commit()
            return {'message': 'Role updated'}
        return {'message': 'Role not found'}, 404

    def delete(self, role_id):
        role = Role.query.get(role_id)
        if role:
            db.session.delete(role)
            db.session.commit()
            return {'message': 'Role deleted'}
        return {'message': 'Role not found'}, 404
    
class PermissionResource(Resource):
    @marshal_with(permission_fields)
    def get(self, permission_id=None):
        if permission_id:
            permission = Permission.query.get(permission_id)
            if permission:
                return permission
            return {'message': 'Permission not found'}, 404
        else:
            permissions = Permission.query.all()
            return permissions

    def post(self):
        args = permission_parser.parse_args()
        permission = Permission(name=args['name'], description=args['description'])
        db.session.add(permission)
        db.session.commit()
        return {'message': 'Permission created', 'permission_id': permission.permission_id}, 201

    def put(self, permission_id):
        args = permission_parser.parse_args()
        permission = Permission.query.get(permission_id)
        if permission:
            permission.name = args['name']
            permission.description = args['description']
            db.session.commit()
            return {'message': 'Permission updated'}
        return {'message': 'Permission not found'}, 404

    def delete(self, permission_id):
        permission = Permission.query.get(permission_id)
        if permission:
            db.session.delete(permission)
            db.session.commit()
            return {'message': 'Permission deleted'}
        return {'message': 'Permission not found'}, 404
class RolePermissionResource(Resource):
    def post(self):
        args = role_permission_parser.parse_args()
        role_permission = RolePermission(role_id=args['role_id'], permission_id=args['permission_id'])
        db.session.add(role_permission)
        db.session.commit()
        return {'message': 'Role Permission mapping created'}, 201

    def delete(self):
        args = role_permission_parser.parse_args()
        role_permission = RolePermission.query.filter_by(role_id=args['role_id'], permission_id=args['permission_id']).first()
        if role_permission:
            db.session.delete(role_permission)
            db.session.commit()
            return {'message': 'Role Permission mapping deleted'}
        return {'message': 'Role Permission mapping not found'}, 404


class UserRoleResource(Resource):
    def post(self):
        args = user_role_parser.parse_args()
        user_role = UserRole(user_id=args['user_id'], role_id=args['role_id'])
        db.session.add(user_role)
        db.session.commit()
        return {'message': 'User Role mapping created'}, 201

    def delete(self):
        args = user_role_parser.parse_args()
        user_role = UserRole.query.filter_by(user_id=args['user_id'], role_id=args['role_id']).first()
        if user_role:
            db.session.delete(user_role)
            db.session.commit()
            return {'message': 'User Role mapping deleted'}
        return {'message': 'User Role mapping not found'}, 404


# Adding resources to the API
api.add_resource(RoleResource, '/roles', '/roles/<int:role_id>')
api.add_resource(PermissionResource, '/permissions', '/permissions/<int:permission_id>')
api.add_resource(RolePermissionResource, '/role_permissions')
api.add_resource(UserRoleResource, '/user_roles')


from flask import Blueprint, request
from flask_restful import Resource, Api, reqparse
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import check_password_hash
from models import db, User, UserRole, RolePermission, Permission, Role, AuditLog

auth_bp = Blueprint("auth", __name__)
api = Api(auth_bp)

user_parser = reqparse.RequestParser()
user_parser.add_argument("username", type=str, required=True, help="Username is required")
user_parser.add_argument("password", type=str, required=True, help="Password is required")
user_parser.add_argument("role", type=str, required=True, help="Role is required")
user_parser.add_argument("email", type=str, required=False, help="Email is required")
user_parser.add_argument("isActive", type=bool, default=False, help="Is active or inactive for this user")
user_parser.add_argument("first_name", type=str, required=False, help="First name of the user")
user_parser.add_argument("last_name", type=str, required=False, help="Last name of the user")


class UserLogin(Resource):
    def post(self):
        # Parse request data
        data = request.get_json()
        if not data or "username" not in data or "password" not in data:
            return {"message": "Username and password are required"}, 400
        
        # Find user
        user = User.query.filter_by(username=data["username"]).first()
        if not user or not check_password_hash(user.password_hash, data["password"]):
            return {"message": "Invalid username or password"}, 401

        # Check if user is active
        if not user.isActive:
            return {"message": "User account is inactive. Please contact the administrator."}, 403

        # Fetch user's roles and permissions
        roles = UserRole.query.filter_by(user_id=user.user_id).all()
        role_ids = [role.role_id for role in roles]
        permissions = RolePermission.query.filter(RolePermission.role_id.in_(role_ids)).all()
        permission_names = [Permission.query.get(perm.permission_id).name for perm in permissions]

        # Generate JWT tokens
        access_token = create_access_token(identity={
            "user_id": user.user_id,
            "username": user.username,
            "roles": [Role.query.get(role_id).name for role_id in role_ids],
            "permissions": permission_names
        })
        refresh_token = create_refresh_token(identity={"user_id": user.user_id})
        
        user_information = {
            "user_id": user.user_id,
            "username": user.username,
            "roles": [Role.query.get(role_id).name for role_id in role_ids],
            "permissions": permission_names,
            "email": user.email,
            "isActive": user.isActive,
            "created_at": user.created_at.isoformat(),
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        
        return {
            "message": "Login successful",
            "user_info": user_information
        }, 200


class UserResource(Resource):
    def get(self, user_id=None):
        """Retrieve a specific user or all users."""
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404
            return {
                "user_id": user.user_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "email": user.email,
                "isActive": user.isActive,
                "created_at": user.created_at.isoformat(),
            }
        users = User.query.all()
        return [
            {
                "user_id": user.user_id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": user.role,
                "email": user.email,
                "isActive": user.isActive,
                "created_at": user.created_at.isoformat(),
            }
            for user in users
        ]

    def post(self):
        """Create a new user."""
        args = user_parser.parse_args()

        if User.query.filter_by(username=args["username"]).first():
            return {"message": "Username already exists"}, 400

        if User.query.filter_by(email=args["email"]).first():
            return {"message": "Email already exists"}, 400

        user = User(
            username=args["username"],
            role=args["role"],
            email=args["email"],
            first_name=args.get("first_name"),
            last_name=args.get("last_name"),
            isActive=args["isActive"],
        )
        user.set_password(args["password"])
        db.session.add(user)
        db.session.commit()

        # Log user creation action
        log = AuditLog(
            user_id=user.user_id,
            action="CREATE",
            description=f"Created user {user.username}",
        )
        db.session.add(log)
        db.session.commit()

        return {"message": "User created successfully", "user_id": user.user_id}, 201

    def patch(self, user_id):
        """Update an existing user."""
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        args = user_parser.parse_args()
        if args["username"]:
            if User.query.filter_by(username=args["username"]).first():
                return {"message": "Username already exists"}, 400
            user.username = args["username"]

        if args["email"]:
            if User.query.filter_by(email=args["email"]).first():
                return {"message": "Email already exists"}, 400
            user.email = args["email"]

        if args["role"]:
            user.role = args["role"]

        if args["first_name"]:
            user.first_name = args["first_name"]

        if args["last_name"]:
            user.last_name = args["last_name"]

        user.isActive = args["isActive"]

        if args["password"]:
            user.set_password(args["password"])

        db.session.commit()

        # Log user update action
        log = AuditLog(
            user_id=user.user_id,
            action="UPDATE",
            description=f"Updated user {user.username}",
        )
        db.session.add(log)
        db.session.commit()

        return {"message": "User updated successfully"}

    def delete(self, user_id):
        """Delete a user."""
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        # Check if there are any existing audit logs for this user
        existing_log = AuditLog.query.filter_by(user_id=user_id).first()
        
        # If there's an existing audit log, don't delete the user
        if existing_log:
            return {"message": "User cannot be deleted because an audit log exists"}, 400

        # Log user deletion action before deleting the user if no audit log exists
        log = AuditLog(
            user_id=user.user_id,
            action="DELETE",
            description=f"Deleted user {user.username}",
        )
        db.session.add(log)

        # Now delete the user
        db.session.delete(user)
        db.session.commit()

        return {"message": "User deleted successfully"}


    
    def put(self, user_id):
        """Update user permissions."""
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404
        
        # Parse permissions from the request body
        data = request.get_json()
        if not data or "permissions" not in data:
            return {"message": "Permissions are required"}, 400
        
        permissions = data["permissions"]  # Expecting a list of permission IDs
        
        # Validate permissions
        valid_permissions = Permission.query.filter(Permission.permission_id.in_(permissions)).all()
        valid_permission_ids = [perm.permission_id for perm in valid_permissions]
        
        if len(valid_permissions) != len(permissions):
            invalid_perms = [str(perm) for perm in permissions if perm not in valid_permission_ids]
            return {"message": f"Invalid permissions: {', '.join(invalid_perms)}"}, 400
        
        # Update permissions for the user's roles
        user_roles = UserRole.query.filter_by(user_id=user.user_id).all()
        for user_role in user_roles:
            # Clear existing permissions for the role
            RolePermission.query.filter_by(role_id=user_role.role_id).delete()
            
            # Assign new permissions
            for perm in valid_permissions:
                role_permission = RolePermission(role_id=user_role.role_id, permission_id=perm.permission_id)
                db.session.add(role_permission)
        
        db.session.commit()
        
        # Log permission update
        log = AuditLog(
            user_id=user.user_id,
            action="UPDATE_PERMISSIONS",
            description=f"Updated permissions for user {user.username} to: {', '.join(map(str, valid_permission_ids))}"
        )
        db.session.add(log)
        db.session.commit()
        
        return {"message": "Permissions updated successfully", "permissions": valid_permission_ids}, 200


class TokenRefresh(Resource):
    @jwt_required(refresh=True)
    def post(self):
        # Get the identity of the user from the refresh token
        current_user = get_jwt_identity()

        # Generate a new access token
        new_access_token = create_access_token(identity=current_user)

        return {
            "message": "Token refreshed successfully",
            "access_token": new_access_token
        }, 200


# Add the refresh token endpoint to the API
api.add_resource(TokenRefresh, "/refresh-token")
api.add_resource(UserLogin, "/login")
api.add_resource(UserResource, "/users", "/users/<int:user_id>")

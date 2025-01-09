from flask import Blueprint, request
from flask_restful import Resource, Api, reqparse
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.security import check_password_hash
from models import db, User, UserRole, RolePermission, Permission, Role

auth_bp = Blueprint("auth", __name__)
api = Api(auth_bp)

user_parser = reqparse.RequestParser()
user_parser.add_argument("username", type=str, required=True, help="Username is required")
user_parser.add_argument("password", type=str, required=True, help="Password is required")
user_parser.add_argument("role", type=str, required=True, help="Role is required")
user_parser.add_argument("email", type=str, required=False, help="Email is required")
user_parser.add_argument("isActive", type=bool, default=False, help="Is active or inactive for this user")


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
    # @jwt_required()
    def get(self, user_id=None):
        """Retrieve a specific user or all users."""
        if user_id:
            user = User.query.get(user_id)
            if not user:
                return {"message": "User not found"}, 404
            return {
                "user_id": user.user_id,
                "username": user.username,
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
                "role": user.role,
                "email": user.email,
                "isActive": user.isActive,
                "created_at": user.created_at.isoformat(),
            }
            for user in users
        ]

    # @jwt_required()
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
            isActive=args["isActive"],
        )
        user.set_password(args["password"])
        db.session.add(user)
        db.session.commit()

        return {"message": "User created successfully", "user_id": user.user_id}, 201

    # @jwt_required()
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

        user.isActive = args["isActive"]

        if args["password"]:
            user.set_password(args["password"])

        db.session.commit()
        return {"message": "User updated successfully"}

    # @jwt_required()
    def delete(self, user_id):
        """Delete a user."""
        user = User.query.get(user_id)
        if not user:
            return {"message": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()
        return {"message": "User deleted successfully"}


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

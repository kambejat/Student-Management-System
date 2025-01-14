from models import db, Role, Permission, RolePermission

# Predefined roles
roles = [
    {"name": "Admin", "description": "Administrator with full access"},
    {"name": "Teacher", "description": "Teacher with limited access"},
    {"name": "Student", "description": "Student with basic access"},
    {"name": "Parent", "description": "Parent with basic access"},
]

# Predefined permissions
permissions = [
    {"name": "view_students", "description": "View student details"},
    {"name": "add_students", "description": "Add new students"},
    {"name": "update_students", "description": "Update student details"},
    {"name": "delete_students", "description": "Delete student records"},
]

# Predefined role-permission mappings
role_permissions = {
    "Admin": ["view_students", "add_students", "update_students", "delete_students"],
    "Teacher": ["view_students", "update_students"],
    "Student": ["view_students", "view_results"],
    "Parent": ["view_students", "view_reports"],
}

def init_roles_and_permissions():
    # Check if roles exist, if not, create them
    for role_data in roles:
        role = Role.query.filter_by(name=role_data["name"]).first()
        if not role:
            role = Role(name=role_data["name"], description=role_data["description"])
            db.session.add(role)

    # Check if permissions exist, if not, create them
    for perm_data in permissions:
        permission = Permission.query.filter_by(name=perm_data["name"]).first()
        if not permission:
            permission = Permission(name=perm_data["name"], description=perm_data["description"])
            db.session.add(permission)

    # Commit roles and permissions to the database if any were added
    db.session.commit()

    # Map roles to permissions
    for role_name, permission_names in role_permissions.items():
        role = Role.query.filter_by(name=role_name).first()  # Dynamically use role_name
        if role is None:
            print(f"Role '{role_name}' not found in database!")
            continue  # Skip if role doesn't exist

        for perm_name in permission_names:
            permission = Permission.query.filter_by(name=perm_name).first()
            if permission:
                # Check if the role-permission mapping already exists
                role_permission = RolePermission.query.filter_by(role_id=role.role_id, permission_id=permission.permission_id).first()
                if not role_permission:
                    role_permission = RolePermission(role_id=role.role_id, permission_id=permission.permission_id)
                    db.session.add(role_permission)
                else:
                    print(f"Role '{role_name}' already has permission '{perm_name}'")

    # Commit role-permission mappings to the database if any were added
    db.session.commit()

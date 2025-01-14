import random
import string
from sqlalchemy.orm import validates
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'Users'
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'parent', 'teacher', 'admin'), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    isActive = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)


    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


# Additional tables for user management and permissions
class Role(db.Model):
    __tablename__ = 'roles'
    role_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)


class Permission(db.Model):
    __tablename__ = 'permissions'
    permission_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(100), nullable=True)


class RolePermission(db.Model):
    __tablename__ = 'role_permissions'
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'), primary_key=True)
    permission_id = db.Column(db.Integer, db.ForeignKey('permissions.permission_id'), primary_key=True)

    role = db.relationship('Role', backref='role_permissions', lazy=True)
    permission = db.relationship('Permission', backref='role_permissions', lazy=True)


class UserRole(db.Model):
    __tablename__ = 'user_roles'
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.role_id'), primary_key=True)

    user = db.relationship('User', backref='user_roles', lazy=True)
    role = db.relationship('Role', backref='user_roles', lazy=True)


class AuditLog(db.Model):
    __tablename__ = 'audit_logs'
    log_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    
    user = db.relationship('User', backref='audit_logs', lazy=True)

    def __repr__(self):
        return f"<AuditLog {self.user.username} - {self.action}>"
    

class Student(db.Model):
    __tablename__ = 'students'
    student_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    enrollment_year = db.Column(db.Date, nullable=False)
    grade_level = db.Column(db.Enum('F1', 'F2', 'F3', 'F4'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)

    user = db.relationship('User', backref='student', lazy=True)



class Parent(db.Model):
    __tablename__ = 'parents'
    parent_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(15))

    user = db.relationship('User', backref='parent', lazy=True)


class ParentStudent(db.Model):
    __tablename__ = 'parent_student'
    parent_id = db.Column(db.Integer, db.ForeignKey('parents.parent_id'), primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), primary_key=True)


class Subject(db.Model):
    __tablename__ = 'subjects'
    subject_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    grade_level = db.Column(db.Enum('F1', 'F2', 'F3', 'F4'), nullable=False)
    teacher = db.Column(db.String(100), nullable=True)


class Classes(db.Model):
    __tablename__ = 'classes'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.subject_id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teachers.teacher_id'), nullable=False)
    schedule_time = db.Column(db.Time, nullable=False)

    subject = db.relationship('Subject', backref='classes', lazy=True)
    teacher = db.relationship('Teacher', backref='classes', lazy=True, foreign_keys=[teacher_id])


class Teacher(db.Model):
    __tablename__ = 'teachers'
    teacher_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.Enum('Male', 'Female', 'Other'), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False, unique=True)
    date_of_birth = db.Column(db.Date, nullable=False)

    user = db.relationship('User', backref='teacher', lazy=True)
    class_ = db.relationship('Classes', backref='teachers', lazy=True, foreign_keys=[class_id])


class Result(db.Model):
    __tablename__ = 'results'
    result_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.subject_id'), nullable=False)
    term = db.Column(db.Enum('Term 1', 'Term 2', 'Term 3'), nullable=False)
    grade = db.Column(db.String(2), nullable=False)
    exam_date = db.Column(db.Date, nullable=False)
    remarks = db.Column(db.Text)

    student = db.relationship('Student', backref='results', lazy=True)
    subject = db.relationship('Subject', backref='results', lazy=True)


class Attendance(db.Model):
    __tablename__ = 'Attendance'
    attendance_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=False)
    attendance_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('Present', 'Absent', 'Late'), nullable=False)

    student = db.relationship('Student', backref='attendance', lazy=True)
    class_ = db.relationship('Classes', backref='attendance', lazy=True)




class FeesCollection(db.Model):
    __tablename__ = 'fees_collection'
    fee_id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('students.student_id'), nullable=False)
    reference_number = db.Column(db.String(20), unique=True, nullable=False)
    amount_paid = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, nullable=False)
    payment_method = db.Column(db.String(50), nullable=False)  # e.g., "Cash", "Bank Transfer"
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    student = db.relationship('Student', backref='fees_collection', lazy=True)

    @validates('reference_number')
    def generate_reference_number(self, key, reference_number):
        if not reference_number:
            # Auto-generate reference number (ClassName + 10 digits)
            class_name = self.student.class_.name  # Assuming Class name exists in the 'Classes' table
            random_number = ''.join(random.choices(string.digits, k=10))
            reference_number = f"{class_name}{random_number}"
        return reference_number


class Expense(db.Model):
    __tablename__ = 'expenses'
    expense_id = db.Column(db.Integer, primary_key=True)
    expense_type = db.Column(db.String(100), nullable=False)  # E.g., "Operational", "Maintenance"
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    expense_date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<Expense {self.expense_type}: {self.amount} on {self.expense_date}>"
    


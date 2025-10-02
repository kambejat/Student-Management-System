from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import (
    jwt_required
)
from flask.views import MethodView
from app import db
from models import Grade, Student, Subject
import pandas as pd
from io import BytesIO
from datetime import datetime, date
from openpyxl import load_workbook
from openpyxl.worksheet.datavalidation import DataValidation

def to_python_date(value):
    if not value:
        return date.today()  # fallback
    try:
        # Remove 'Z', handle ISO format
        dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        return dt.date()
    except Exception as e:
        print(f"Invalid date: {value}, error: {e}")
        return date.today()

grades_bp = Blueprint('grades', __name__)

# --- Grade API (CRUD + List) ---
class GradeAPI(MethodView):
    @jwt_required()
    def get(self):
        grades = Grade.query.all()

        results = []
        for g in grades:
            student = Student.query.get(g.student_id)
            subject = Subject.query.get(g.subject_id)

            results.append({
                'grade_id': g.grade_id,
                'student': {
                    'student_id': student.student_id,
                    'first_name': student.first_name,
                    'last_name': student.last_name,
                    'class_id': student.class_id
                },
                'subject': {
                    'subject_id': subject.subject_id,
                    'name': subject.name,
                },
                'term': g.term,
                'exam_type': g.exam_type,
                'score': g.score,
                'max_score': g.max_score,
                'percentage': g.percentage,
                'grade_letter': g.grade_letter,
                'remarks': g.remarks,
                'exam_date': g.exam_date.strftime('%Y-%m-%d') if g.exam_date else None
            })

        return jsonify(results)
    
# --- Single Grade (DELETE) ---
class SingleGradeAPI(MethodView):
    def delete(self, grade_id):
        grade = Grade.query.get_or_404(grade_id)
        db.session.delete(grade)
        db.session.commit()
        return jsonify({'message': 'Grade deleted successfully'})

# --- Import grades from CSV ---
class ImportGradesAPI(MethodView):
    def post(self):
        data = request.get_json()
        if not data:
            return jsonify({"message": "No data provided"}), 400

        imported_entries = []
        errors = []

        for idx, item in enumerate(data):
            try:
                student_id = int(item.get('student_id'))
                subject_id = int(item.get('subject_id'))
                class_id = int(item.get('class_id'))
                term = item.get('term')
                exam_type = item.get('exam_type')
                score = int(item.get('score'))
                max_score = int(item.get('max_score'))
                remarks = item.get('remarks')
                exam_date = datetime.strptime(item.get('exam_date'), "%d/%m/%Y").date()


                # Validate required fields
                if not all([student_id, subject_id, class_id, term, exam_type, score is not None, max_score is not None]):
                    errors.append({
                        "index": idx,
                        "student_id": student_id,
                        "error": "Missing required fields"
                    })
                    continue

                grade = Grade(
                    student_id=student_id,
                    subject_id=subject_id,
                    class_id=class_id,
                    term=term,
                    exam_type=exam_type,
                    score=score,
                    max_score=max_score,
                    remarks=remarks,
                    exam_date=exam_date
                )
                grade.calculate_percentage_and_grade()
                db.session.add(grade)

                imported_entries.append({
                    "student_id": student_id,
                    "subject_id": subject_id,
                    "term": term,
                    "score": score
                })
            except Exception as e:
                errors.append({
                    "index": idx,
                    "student_id": item.get('student_id'),
                    "error": str(e)
                })

        if imported_entries:
            db.session.commit()

        response = {
            "message": f"{len(imported_entries)} grade entries imported successfully",
            "imported_entries": imported_entries
        }
        if errors:
            response["errors"] = errors

        return jsonify(response), 201 if imported_entries else 400
    

class ExportGradesAPI(MethodView):
    def get(self, subject_id):
        students = Student.query.all()
        subject = Subject.query.get(subject_id)

        if not students or not subject:
            return jsonify({'error': 'No students or subject found'}), 404

        # Dropdown options (move here)
        term_values = ['Term 1', 'Term 2', 'Term 3']
        exam_type_values = ['Midterm', 'Final', 'Quiz', 'Assignment']

        # Prepare rows (no dropdowns inserted here!)
        rows = []
        for student in students:
            rows.append({
                'student_id': student.student_id,
                'student_name': f"{student.first_name} {student.last_name}",
                'subject_id': subject.subject_id,
                'subject_name': subject.name,
                'class_id': student.class_id,
                'term': '',         # leave empty
                'exam_type': '',    # leave empty
                'score': '',
                'max_score': '',
                'remarks': '',
                'exam_date': ''
            })

        df = pd.DataFrame(rows)

        # Write to Excel buffer using pandas
        temp_buffer = BytesIO()
        with pd.ExcelWriter(temp_buffer, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Grades')
        temp_buffer.seek(0)

        # Load workbook with openpyxl
        wb = load_workbook(temp_buffer)
        ws = wb['Grades']

        # Create data validations
        term_validation = DataValidation(
            type="list",
            formula1=f'"{",".join(term_values)}"',
            showDropDown=True
        )
        exam_type_validation = DataValidation(
            type="list",
            formula1=f'"{",".join(exam_type_values)}"',
            showDropDown=True
        )

        # Add validations to sheet
        ws.add_data_validation(term_validation)
        ws.add_data_validation(exam_type_validation)

        # Apply to proper ranges (F = term, G = exam_type)
        term_validation.add(f'F2:F{len(rows)+1}')
        exam_type_validation.add(f'G2:G{len(rows)+1}')

        # Finalize
        output = BytesIO()
        wb.save(output)
        output.seek(0)

        return send_file(
            output,
            as_attachment=True,
            download_name=f'grade_import_template_subject_{subject_id}.xlsx',
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
  
# --- Register the routes ---
grades_bp.add_url_rule('/grades', view_func=GradeAPI.as_view('grades'))
grades_bp.add_url_rule('/grades/<int:grade_id>', view_func=SingleGradeAPI.as_view('grade_detail'))
grades_bp.add_url_rule('/grades/import', view_func=ImportGradesAPI.as_view('import_grades'))
grades_bp.add_url_rule('/grades/export/<int:subject_id>', view_func=ExportGradesAPI.as_view('export_grades'))

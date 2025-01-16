import React, { useState } from "react";
import axios from "axios";
import { Teacher } from "../../../types/Teacher";

interface Subject {
    subject_id: number;
    name: string;
    grade_level: string;
    teacher?: string;
  }

interface AddSubjectFormProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  toggleModal: () => void;
  teachers: Teacher[]; // Teacher list passed as a prop
}

const AddSubjectForm: React.FC<AddSubjectFormProps> = ({ setError, setSubjects, toggleModal, teachers }) => {
  const [subjectName, setSubjectName] = useState<string>("");
  const [gradeLevel, setGradeLevel] = useState<string>("");
  const [teacher, setTeacher] = useState<string>("");

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subjectName || !gradeLevel) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/subjects", { 
        name: subjectName, 
        grade_level: gradeLevel, 
        teacher
      });
      setSubjects((prev) => [...prev, response.data]);
      toggleModal();
    } catch {
      setError("Failed to add the subject. Please try again.");
    }
  };

  return (
    <form onSubmit={handleAddSubject} className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Subject</h2>

      <div className="mb-4">
        <label htmlFor="subjectName" className="block mb-2 font-medium">Subject Name</label>
        <input
          id="subjectName"
          type="text"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter subject name"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gradeLevel" className="block mb-2 font-medium">Grade Level</label>
        <select
          id="gradeLevel"
          value={gradeLevel}
          onChange={(e) => setGradeLevel(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select Grade Level</option>
          <option value="F1">F1</option>
          <option value="F2">F2</option>
          <option value="F3">F3</option>
          <option value="F4">F4</option>
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="teacher" className="block mb-2 font-medium">Teacher (Optional)</label>
        <input
          id="teacher"
          list="teachersList"
          type="text"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter teacher's name"
        />
        <datalist id="teachersList">
          {teachers.map((teacher) => (
            <option key={teacher.teacher_id} value={`${teacher.first_name} ${teacher.last_name}`} />
          ))}
        </datalist>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={toggleModal}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Subject
        </button>
      </div>
    </form>
  );
};

export default AddSubjectForm;

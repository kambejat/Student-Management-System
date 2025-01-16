// AddForm.tsx
import React from "react";
import { Teacher } from "../../../types/Teacher";

interface AddFormProps {
  subjects: { subject_id: number; name: string; grade_level: string }[];
  teachers: Teacher[];
  selectedSubject: number | null;
  selectedTeacher: string;
  setSelectedSubject: React.Dispatch<React.SetStateAction<number | null>>;
  setSelectedTeacher: React.Dispatch<React.SetStateAction<string>>;
  handleAddTeacher: (e: React.FormEvent) => void;
  error: string;
}

const AddForm: React.FC<AddFormProps> = ({
  subjects,
  teachers,
  selectedSubject,
  selectedTeacher,
  setSelectedSubject,
  setSelectedTeacher,
  handleAddTeacher,
  error,
}) => {
  return (
    <form onSubmit={handleAddTeacher} className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Teacher to Subject</h2>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="mb-4">
        <label htmlFor="subject" className="block mb-2 font-medium">
          Select Subject
        </label>
        <select
          id="subject"
          value={selectedSubject || ""}
          onChange={(e) => setSelectedSubject(Number(e.target.value) || null)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Select a Subject --</option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.name} ({subject.grade_level})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="teacher" className="block mb-2 font-medium">
          Select Teacher
        </label>
        <input
          list="teachers"
          id="teacher"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Choose a teacher"
        />
        <datalist id="teachers">
          {teachers.map((teacher) => (
            <option key={teacher.teacher_id} value={`${teacher.first_name} ${teacher.last_name}`}>
              {teacher.first_name} {teacher.last_name}
            </option>
          ))}
        </datalist>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Teacher
      </button>
    </form>
  );
};

export default AddForm;

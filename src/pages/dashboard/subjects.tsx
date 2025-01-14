import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";

interface Subject {
  subject_id: number;
  name: string;
  grade_level: string;
  teacher?: string;
}

interface Teacher {
  teacher_id: number;
  name: string;
}

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Fetch subjects from the API
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get<Subject[]>("/api/subjects");
        setSubjects(response.data);
      } catch {
        setError("Failed to fetch subjects. Please try again later.");
      }
    };
    fetchSubjects();
  }, []);

  // Fetch teachers from the API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get<Teacher[]>("/api/teachers");
        setTeachers(response.data);
      } catch {
        setError("Failed to fetch teachers. Please try again later.");
      }
    };
    fetchTeachers();
  }, []);

  // Handle form submission
  const handleAddTeacher = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedSubject || !selectedTeacher) {
      setError("Please select a subject and a teacher.");
      return;
    }

    try {
      await axios.put(`/api/subjects/${selectedSubject}`, { teacher: selectedTeacher });
      setSubjects((prev) =>
        prev.map((subject) =>
          subject.subject_id === selectedSubject ? { ...subject, teacher: selectedTeacher } : subject
        )
      );
      setSelectedTeacher("");
      setSelectedSubject(null);
      setError("");
    } catch {
      setError("Failed to update the subject. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Subjects</h1>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <table className="table-auto w-full border border-gray-200 shadow-md mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Grade Level</th>
            <th className="border px-4 py-2">Teacher</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.subject_id} className="text-center">
              <td className="border px-4 py-2">{subject.subject_id}</td>
              <td className="border px-4 py-2">{subject.name}</td>
              <td className="border px-4 py-2">{subject.grade_level}</td>
              <td className="border px-4 py-2">{subject.teacher || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddTeacher} className="bg-gray-100 p-4 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add Teacher to Subject</h2>

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
              <option key={teacher.teacher_id} value={teacher.name}>
                {teacher.name}
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
    </div>
  );
};

export default SubjectsPage;

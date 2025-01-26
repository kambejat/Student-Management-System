import React, { useState } from "react";
import axios from "axios";
import { Teacher } from "../../../types/types";

interface ClassroomProps {
  id: number;
  name: string;
  subject_id: number;
  teacher_id: number;
  schedule_time: string;
}

interface Subject {
  subject_id: number;
  name: string;
  grade_level: string;
  teacher?: string;
}

interface AddClassroomProps {
  setError: React.Dispatch<React.SetStateAction<string>>;
  setClassroom: React.Dispatch<React.SetStateAction<ClassroomProps[]>>;
  toggleModal: () => void;
  teachers: Teacher[];
  subjects: Subject[];
}

const AddClassroom: React.FC<AddClassroomProps> = ({
  setError,
  setClassroom,
  toggleModal,
  teachers,
  subjects,
}) => {
  const [classroomName, setClassroomName] = useState<string>("");
  const [subjectId, setSubjectId] = useState<number>(0);
  const [teacherId, setTeacherId] = useState<number>(0);
  const [scheduleTime, setScheduleTime] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: classroomName,
      subject_id: subjectId || null,
      teacher_id: teacherId || null, // Allow teacher_id to be optional
      // schedule_time: scheduleTime || null,
    }

    console.log(payload);

    try {
      const response = await axios.post("/api/classes", payload);

      setClassroom((prev) => [...prev, response.data]);
      toggleModal();
    } catch (error) {
      setError(`Failed to submit: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Classroom</h2>

      {/* Classroom Name */}
      <div className="mb-4">
        <label htmlFor="classroomName" className="block mb-2 font-medium">
          Classroom Name
        </label>
        <input
          id="classroomName"
          type="text"
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          placeholder="Enter classroom name"
          required
        />
      </div>

      {/* Subject Selection */}
      <div className="mb-4">
        <label htmlFor="subject" className="block mb-2 font-medium">
          Subject
        </label>
        <select
          id="subject"
          value={subjectId}
          onChange={(e) => setSubjectId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        >
          <option value="" disabled>
            Select a subject
          </option>
          {subjects.map((subject) => (
            <option key={subject.subject_id} value={subject.subject_id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Teacher Selection */}
      <div className="mb-4">
        <label htmlFor="teacher" className="block mb-2 font-medium">
          Teacher (Optional)
        </label>
        <select
          id="teacher"
          value={teacherId}
          onChange={(e) => setTeacherId(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.teacher_id} value={teacher.teacher_id}>
              {`${teacher.first_name} ${teacher.last_name}`}
            </option>
          ))}
        </select>
      </div>

      {/* Schedule Time */}
      <div className="mb-4">
        <label htmlFor="scheduleTime" className="block mb-2 font-medium">
          Schedule Time
        </label>
        <input
          id="scheduleTime"
          type="datetime-local"
          value={scheduleTime}
          onChange={(e) => setScheduleTime(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>

      {/* Buttons */}
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
          Add Classroom
        </button>
      </div>
    </form>
  );
};

export default AddClassroom;

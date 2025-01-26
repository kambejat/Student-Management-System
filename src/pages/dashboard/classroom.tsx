import React, { useEffect, useState } from "react";
import { Teacher } from "../../types/types";
import axios from "axios";
import { AddIcon, Pen, DeleteIcon } from "../../ui/icon/icons";
import Modal from "../../ui/component/Modal";
import AddClassroom from "../../ui/component/classroom/AddClassroom";

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
const Classroom: React.FC = () => {
  const [classroom, setClassroom] = useState<ClassroomProps[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [formData, setFormData] = useState<Omit<ClassroomProps, "id">>({
    name: "",
    subject_id: 0,
    teacher_id: 0,
    schedule_time: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/classes");
      setClassroom(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get<Subject[]>("/api/subjects");
      setSubjects(response.data);
    } catch {
      setError("Failed to fetch subjects. Please try again later.");
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get<Teacher[]>("/api/teachers");
      setTeachers(response.data);
    } catch {
      setError("Failed to fetch teachers. Please try again later.");
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      subject_id: 0,
      teacher_id: 0,
      schedule_time: "",
    });
    setIsEditing(false);
  }


  const handleEdit = (classroom: ClassroomProps) => {
    setFormData({
      name: classroom.name,
      subject_id: classroom.subject_id,
      teacher_id: classroom.teacher_id,
      schedule_time: classroom.schedule_time,
    });
    setIsEditing(true);
    toggleModal();
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/classes/${id}`);
      setClassroom((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  const filteredClassroom = classroom.filter((classroom) =>
    classroom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-4">
      <div className="sm:flex justify-between mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md p-2 w-full sm:w-1/2"
          placeholder="Search classrooms..."
        />
        <button
          onClick={() => {
            resetForm();
            toggleModal();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          <AddIcon className="inline-block mr-2" />
          Add Class
        </button>
      </div>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Classroom Name</th>
            <th className="border border-gray-300 px-4 py-2">Subject</th>
            <th className="border border-gray-300 px-4 py-2">Teacher</th>
            <th className="border border-gray-300 px-4 py-2">Schedule Time</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClassroom.map((classroom) => {
            const subject = subjects.find((s) => s.subject_id === classroom.subject_id);
            const teacher = teachers.find((t) => t.teacher_id === classroom.teacher_id);

            return (
              <tr key={classroom.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{classroom.name}</td>
                <td className="border border-gray-300 px-4 py-2">{subject?.name || "N/A"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {teacher ? `${teacher.first_name} ${teacher.last_name}` : "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">{classroom.schedule_time}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(classroom)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded-md mr-2"
                  >
                    <Pen />
                  </button>
                  <button
                    onClick={() => handleDelete(classroom.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Modal 
      Content={
        <AddClassroom 
        setError={setError}
        setClassroom={setClassroom}
        toggleModal={toggleModal}
        teachers={teachers}
        subjects={subjects}

        />
      }
      isOpen={isOpen}
      toggleModal={toggleModal}
      />

      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Classroom;

import React, { useEffect, useState } from "react";
import { Teacher } from "../../types/types";
import axios from "axios";
import { AddIcon, Pen, DeleteIcon, ExportIcon } from "../../ui/icon/icons";
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
    <div className="flex flex-col p-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
       {/* Header */}
            <div className="sm:flex justify-between items-center mb-2">
              <form className="lg:pr-3">
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-200 p-1.5 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Search for classroom"
                  />
                </div>
              </form>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => {
                    resetForm();
                    toggleModal();
                  }}
                  type="button"
                  className="inline-flex items-center justify-center p-1.5 text-sm font-medium text-white bg-blue-800 rounded-md hover:bg-blue-700"
                >
                  <AddIcon className="mr-2 -ml-1 h-5 w-5" />
                  Add Parent
                </button>
                <button className="inline-flex items-center justify-center p-1.5 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white">
                  <ExportIcon className="mr-2 -ml-1 h-5 w-5" />
                  Export
                </button>
              </div>
            </div>

     <div className="overflow-x-auto rounded-md shadow">
     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Classroom Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Teacher</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Schedule Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {filteredClassroom.map((classroom) => {
            const subject = subjects.find((s) => s.subject_id === classroom.subject_id);
            const teacher = teachers.find((t) => t.teacher_id === classroom.teacher_id);

            return (
              <tr key={classroom.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{classroom.name}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{subject?.name || "N/A"}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {teacher ? `${teacher.first_name} ${teacher.last_name}` : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{classroom.schedule_time}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  <button
                    onClick={() => handleEdit(classroom)}
                    className="bg-yellow-500 text-center align-center text-white px-2 py-1 rounded-md mr-2"
                  >
                    <Pen className="text-center" />
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
     </div>

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

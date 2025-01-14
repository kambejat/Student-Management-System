import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Teacher {
  teacher_id: number;
  class_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
}

interface User {
  user_id: number;
  name: string; // Combining first_name and last_name for selection
}

interface Class {
  class_id: number;
  name: string;
}

interface FormData {
  user_id: number | "";
  class_id: number | "";
  first_name: string;
  last_name: string;
  gender: string;
  phone_number: string;
  date_of_birth: string;
}

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    user_id: "",
    class_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    date_of_birth: "",
  });
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );

  // Fetch teachers, users, and classes from the API
  const fetchTeachers = async () => {
    try {
      const response = await axios.get<Teacher[]>("/api/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get<Class[]>("/api/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  // Handle form input change
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "user_id" || name === "class_id" ? Number(value) : value,
    });
  };

  // Handle user selection from datalist
  const handleUserSelection = (e: ChangeEvent<HTMLInputElement>) => {
    const user = users.find((user) => `${user.name}` === e.target.value);
    if (user) {
      setFormData({
        ...formData,
        user_id: user.user_id,
        first_name: user.name.split(" ")[0],
        last_name: user.name.split(" ")[1] || "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`/api/teachers/${selectedTeacherId}`, formData);
      } else {
        await axios.post("/api/teachers", formData);
      }
      fetchTeachers();
      closeModal();
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  // Open modal for editing
  const openEditModal = (teacher: Teacher) => {
    setIsEditMode(true);
    setFormData({
      user_id: teacher.teacher_id,
      class_id: teacher.class_id,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      gender: teacher.gender,
      phone_number: teacher.phone_number,
      date_of_birth: teacher.date_of_birth,
    });
    setSelectedTeacherId(teacher.teacher_id);
    setIsModalOpen(true);
  };

  const handleDelete = async (teacherId: number) => {
    try {
      await axios.delete(`/api/teachers/${teacherId}`);
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  // Open modal for adding
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      user_id: "",
      class_id: "",
      first_name: "",
      last_name: "",
      gender: "",
      phone_number: "",
      date_of_birth: "",
    });
    setSelectedTeacherId(null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchTeachers();
    fetchUsers();
    fetchClasses();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>
      <button
        onClick={openAddModal}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Teacher
      </button>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Class</th>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher.teacher_id}>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.teacher_id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.class_id}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.first_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {teacher.last_name}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => openEditModal(teacher)}
                  className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(teacher.teacher_id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              {isEditMode ? "Edit Teacher" : "Add Teacher"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">User</label>
                <input
                  list="users"
                  onChange={handleUserSelection}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <datalist id="users">
                  {users.map((user) => (
                    <option key={user.user_id} value={user.name} />
                  ))}
                </datalist>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Class</label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.class_id} value={cls.class_id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Other form fields for gender, phone_number, date_of_birth */}
              <div className="mb-4">
                <label className="block text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagementPage;

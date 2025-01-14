import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface Student {
  student_id: number;
  user_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  enrollment_year: string;
  grade_level: string;
  class_id: number;
}

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
}

interface Class {
  id: number;
  name: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]); // State to store classes
  const [formData, setFormData] = useState<Student>({
    student_id: 0,
    user_id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    enrollment_year: "",
    grade_level: "",
    class_id: 0,
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    fetchStudents();
    fetchUsers();
    fetchClasses(); // Fetch classes
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/api/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/classes"); // Assuming classes API is available at /classes
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "user_id") {
      const selectedUser = users.find((user) => user.user_id === value);
      if (selectedUser) {
        setFormData({
          ...formData,
          user_id: value,
          first_name: selectedUser.first_name,
          last_name: selectedUser.last_name,
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/students/${formData.student_id}`, formData);
      } else {
        await axios.post("/api/students", formData);
      }
      fetchStudents();
      resetForm();
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      student_id: 0,
      user_id: "",
      first_name: "",
      last_name: "",
      date_of_birth: "",
      enrollment_year: "",
      grade_level: "",
      class_id: 0,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="user_id" className="mb-2 font-semibold">Select User</label>
            <input
              list="users"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
              placeholder="Select User"
            />
            <datalist id="users">
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </datalist>
          </div>

          <div className="flex flex-col">
            <label htmlFor="first_name" className="mb-2 font-semibold">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              className="border rounded p-2"
              required
              readOnly
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="last_name" className="mb-2 font-semibold">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="border rounded p-2"
              required
              readOnly
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="date_of_birth" className="mb-2 font-semibold">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="enrollment_year" className="mb-2 font-semibold">Enrollment Year</label>
            <input
              type="date"
              name="enrollment_year"
              value={formData.enrollment_year}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="grade_level" className="mb-2 font-semibold">Grade Level</label>
            <select
              name="grade_level"
              value={formData.grade_level}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            >
              <option value="">Select Grade</option>
              <option value="F1">F1</option>
              <option value="F2">F2</option>
              <option value="F3">F3</option>
              <option value="F4">F4</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="class_id" className="mb-2 font-semibold">Class</label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            >
              <option value="">Select Class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            {isEditing ? "Update" : "Add"} Student
          </button>
        </div>
      </form>

      {/* Table */}
      <table className="table-auto w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Grade</th>
            <th className="px-4 py-2">Class</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id} className="border-t">
              <td className="px-4 py-2">{student.student_id}</td>
              <td className="px-4 py-2">{student.first_name}</td>
              <td className="px-4 py-2">{student.last_name}</td>
              <td className="px-4 py-2">{student.grade_level}</td>
              <td className="px-4 py-2">
                {classes.find((classItem) => classItem.id === student.class_id)
                  ?.name || "N/A"}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleEdit(student)}
                  className="mr-2 px-2 py-1 bg-green-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(student.student_id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;

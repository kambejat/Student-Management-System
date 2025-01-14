import React, { useEffect, useState } from "react";
import axios from "axios";

interface Parent {
  userId: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
}

const API_URL = "/api";

const ParentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [parent, setParent] = useState<Parent>({
    userId: 0,
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_URL}/students`);
        setStudents(res.data);
      } catch (error) {
        console.error("Error fetching students data:", error);
      }
    };
    fetchStudents();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParent({ ...parent, [name]: value });
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/parents`, {
        user_id: parent.userId,
        first_name: parent.firstName,
        last_name: parent.lastName,
        phone_number: parent.phoneNumber,
      });
      setParent({
        userId: 0,
        firstName: "",
        lastName: "",
        phoneNumber: "",
      });
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data);
    } catch (error) {
      console.error("Error adding parent:", error);
    }
  };

  return (
    <div className="container mx-auto p-5">
      <form onSubmit={handleParentSubmit} className="mb-6">
        <h2 className="text-2xl mb-4">Add Parent</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="userId" className="block">
              Student
            </label>
            <input
              list="studentsList"
              id="userId"
              name="userId"
              value={parent.userId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            <datalist id="studentsList">
              {students.map((student) => (
                <option key={student.student_id} value={student.student_id}>
                  {student.first_name} {student.last_name}
                </option>
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="firstName" className="block">
              Parent Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={parent.firstName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block">
              Parent Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={parent.lastName}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block">
              Parent Phone
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={parent.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Parent
          </button>
        </div>
      </form>

      <table className="w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Student Name</th>
            <th className="px-4 py-2 border border-gray-300">Parent Name</th>
            <th className="px-4 py-2 border border-gray-300">Phone</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td className="px-4 py-2 border border-gray-300">
                {student.first_name} {student.last_name}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {/* Render parent name if exists */}
              </td>
              <td className="px-4 py-2 border border-gray-300">
                {/* Render parent's phone number if exists */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParentManagement;

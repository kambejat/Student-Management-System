import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { AddIcon, DeleteIcon, ExportIcon, Pen } from "../../ui/icon/icons";
import AddStudent from "../../ui/component/student/AddStudent";
import Modal from "../../ui/component/Modal";

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
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState<Omit<Student, "student_id">>({
    user_id: "",
    first_name: "",
    last_name: "",
    date_of_birth: "",
    enrollment_year: "",
    grade_level: "",
    class_id: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false); // State to control modal visibility

  useEffect(() => {
    fetchStudents();
    fetchUsers();
    fetchClasses();
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
      const response = await axios.get("/api/classes");
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
        await axios.put(`/api/students/${formData.user_id}`, formData);
      } else {
        await axios.post("/api/students", formData);
      }
      fetchStudents();
      resetForm();
      toggleModal(); // Close the modal after submission
    } catch (error) {
      console.error("Error saving student:", error);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData(student);
    setIsEditing(true);
    setIsOpen(true); // Open the modal when editing
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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleModal = () => {
    setIsOpen(!isOpen); // Toggle the modal visibility
  };

  const filteredStudents = students.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchTerm)
  );

  return (
    <div className="flex flex-col p-2">
      <div className="sm:flex">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <form className="lg:pr-3" action="#" method="GET">
            <label className="sr-only">Search</label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="search"
                id="users-search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search for students..."
              />
            </div>
          </form>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <button
            onClick={() => {
              resetForm();
              toggleModal(); // Open the modal for adding a new student
            }}
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7]"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            Add Student
          </button>
          <a className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            <ExportIcon />
            Export
          </a>
        </div>
      </div>
      <div className="flex flex-col pt-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      First Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Last Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Grade
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Class
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.student_id}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {student.student_id}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {student.first_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {student.last_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {student.grade_level}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {classes.find((cls) => cls.id === student.class_id)
                          ?.name || "N/A"}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => handleEdit(student)}
                          className="inline-flex mr-1 items-center px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-primary-800"
                        >
                          <Pen /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.student_id)}
                          className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
                          <DeleteIcon /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        Content={
          <AddStudent
            isEditing={isEditing}
            users={users}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            formData={formData}
            resetForm={resetForm}
            classes={classes}
          />
        }
        isOpen={isOpen}
        toggleModal={toggleModal}
      />
    </div>
  );
};

export default StudentManagement;

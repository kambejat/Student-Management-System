import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../ui/component/Modal";
import AddParent from "../../ui/component/parent/AddParent";
import { AddIcon, ExportIcon } from "../../ui/icon/icons";

interface Parent {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface Student {
  student_id: number;
  user_id?: number | "";
  first_name: string;
  last_name: string;
  parent_name: string;
  phone_number: string;
}

const API_URL = "/api";

const ParentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [filteredData, setFilteredData] = useState<Student[]>([]);
  const [parent, setParent] = useState<Parent>({
    user_id: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students
        const studentRes = await axios.get(`${API_URL}/students`);
        setStudents(studentRes.data);

        // Fetch parents
        const parentRes = await axios.get(`${API_URL}/parents`);
        setParents(parentRes.data);

        // Filter students with assigned parents
        const matchedStudents = studentRes.data.map((student: Student) => {
          const matchedParent = parentRes.data.find(
            (parent: Parent) => parent.user_id === student.user_id?.toString()
          );
          return matchedParent
            ? {
                ...student,
                user_id: student.user_id ?? "", // Ensure it remains a number or empty string
                parent_name: `${matchedParent.first_name} ${matchedParent.last_name}`,
                phone_number: matchedParent.phone_number,
              }
            : {
                ...student,
                user_id: student.user_id ?? "", // Ensure consistency
                parent_name: "No Parent Assigned",
                phone_number: "N/A",
              };
        });
        
        setFilteredData(matchedStudents);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParent({ ...parent, [name]: value });
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const payload = {
        user_id: Number(parent.user_id),
        first_name: parent.first_name,
        last_name: parent.last_name,
        phone_number: parent.phone_number,
      };
      console.log(payload);

      // Send POST request to create a new parent
      const response = await axios.post(`${API_URL}/parents`, payload);

      if (response.status === 201) {
        // Clear form
        setParent({
          user_id: "",
          first_name: "",
          last_name: "",
          phone_number: "",
        });

        // Close the modal
        setIsOpen(false);

        // Re-fetch updated data
        const studentRes = await axios.get(`${API_URL}/students`);
        const parentRes = await axios.get(`${API_URL}/parents`);

        setStudents(studentRes.data);
        setParents(parentRes.data);
      }
    } catch (error) {
      console.error("Error adding parent:", error);
      setError("Failed to add parent. Please check the input and try again.");
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null); // Clear errors when modal is toggled
  };

  const filteredStudent = filteredData.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="sm:flex justify-between items-center mb-4">
        <div className="flex items-center">
          <form className="lg:pr-3" action="#" method="GET">
            <label className="sr-only">Search</label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="parent"
                id="users-search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search for parent"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            Add Parent
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            <ExportIcon className="mr-2 -ml-1 h-5 w-5" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Parent Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {filteredStudent.map((student) => (
              <tr key={student.student_id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {student.first_name} {student.last_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {student.parent_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {student.phone_number}
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    className="block w-full p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      const selectedParent = parents.find(
                        (p) => p.user_id === e.target.value
                      );
                      if (selectedParent) {
                        // Update the student's parent
                        const updatedStudents = students.map((s) =>
                          s.student_id === student.student_id
                            ? {
                                ...s,
                                user_id: selectedParent.user_id,
                                parent_name: `${selectedParent.first_name} ${selectedParent.last_name}`,
                                phone_number: selectedParent.phone_number,
                              }
                            : s
                        );
                        // setStudents(updatedStudents);
                      }
                    }}
                  >
                    <option value="">Assign Parent</option>
                    {/* {parents.map((parent) => (
                      <option key={paren} value={parent.user_id}>
                        {parent.first_name} {parent.last_name}
                      </option>
                    ))} */}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Parent */}
      <Modal
        toggleModal={toggleModal}
        isOpen={isOpen}
        Content={
          <AddParent
            students={students}
            parent={parent}
            handleInputChange={handleInputChange}
            handleParentSubmit={handleParentSubmit}
          />
        }
      />
    </div>
  );
};

export default ParentManagement;
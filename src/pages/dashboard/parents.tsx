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
  user: string;
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
    user: "parent",
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [studentRes, parentRes] = await Promise.all([
        axios.get(`${API_URL}/students`),
        axios.get(`${API_URL}/parents`),
      ]);

      console.log(parentRes)

      setStudents(studentRes.data);
      setParents(parentRes.data);

      const matchedStudents = studentRes.data.map((student: Student) => {
        const matchedParent = parentRes.data.find(
          (parent: Parent) => parent.user_id === student.user_id?.toString()
        );

        return {
          ...student,
          user_id: student.user_id ?? "",
          parent_name: matchedParent
            ? `${matchedParent.first_name} ${matchedParent.last_name}`
            : "No Parent Assigned",
          phone_number: matchedParent ? matchedParent.phone_number : "N/A",
        };
      });

      setFilteredData(matchedStudents);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again later.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParent((prev) => ({ ...prev, [name]: value }));
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        user_id: Number(parent.user_id),
        first_name: parent.first_name,
        last_name: parent.last_name,
        phone_number: parent.phone_number,
        user: "parent",
      };

      const response = await axios.post(`${API_URL}/parents`, payload);

      if (response.status === 201) {
        setParent({
          user_id: "",
          first_name: "",
          last_name: "",
          phone_number: "",
          user: "parent",
        });
        setIsOpen(false);
        await fetchData(); // Re-fetch updated data
      }
    } catch (error) {
      console.error("Error adding parent:", error);
      setError("Failed to add parent. Please check the input and try again.");
    }
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  const filteredStudent = filteredData.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
              onChange={handleSearch}
              className="bg-gray-200 p-1.5 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              placeholder="Search for parent"
            />
          </div>
        </form>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={toggleModal}
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

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {error}
        </div>
      )}

      {/* Table */}
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
                    className="block w-full p-2 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    onChange={async (e) => {
                      const selectedUserId = e.target.value;
                      const selectedParent = parents.find(
                        (p) => p.user_id === selectedUserId
                      );

                      if (selectedParent) {
                        try {
                          await axios.put(
                            `${API_URL}/students/${student.student_id}`,
                            { user_id: Number(selectedParent.user_id) }
                          );

                          await fetchData(); // Refresh the state
                        } catch (err) {
                          console.error("Failed to assign parent:", err);
                          setError("Failed to assign parent. Please try again.");
                        }
                      }
                    }}
                  >
                    <option value="">Assign Parent</option>
                    {parents
                      .filter((p) => p.user === "parent")
                      .map((p) => (
                        <option key={p.user_id} value={p.user_id}>
                          {p.first_name} {p.last_name}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Parent Modal */}
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

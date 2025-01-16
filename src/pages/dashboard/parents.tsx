import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../ui/component/Modal";
import AddParent from "../../ui/component/parent/AddParent";
import { AddIcon, ExportIcon } from "../../ui/icon/icons";

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
  parent_name: string;
  phone_number: string;
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
      alert(response.data.message);
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

  const toggleModal = () => {
    setIsOpen(false);
  };

  const filteredStudent = students.filter((student) =>
    `${student.first_name} ${student.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col p-1">
      <div className="sm:flex">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <form className="lg:pr-3 " action="#" method="GET">
            <label className="sr-only">Search</label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="parent"
                id="users-search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search for parent"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsOpen(true)}
            type="button"
            data-modal-target="add-user-modal"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7]"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            Add Parent
          </button>
          <a
            // onClick={exportUsersToExcel}
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
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
                      Student Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Parent Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudent.map((student) => (
                    <tr
                      key={student.student_id}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {student.first_name} {student.last_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {student.parent_name || "No Parent Assigned"}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                      {student.phone_number || "N/A"}
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

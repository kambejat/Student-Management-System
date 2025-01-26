// TeacherManagementPage.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Teacher, User, Class, FormData } from "../../types/types";
import Modal from "../../ui/component/Modal";
import { AddIcon, ExportIcon, Pen } from "../../ui/icon/icons";
import AddForm from "../../ui/component/teachers/AddForm";
import EditForm from "../../ui/component/teachers/EditForm";

const TeacherManagementPage: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSubmit = async (formData: FormData) => {
    try {
      // Log form data before submission to check values
      console.log(formData);

      // Fix the payload to properly map class_id and user_id
      const payload = {
        user_id: formData.user_id,
        class_id: formData.class_id, // Ensure class_id is coming from formData
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        phone_number: formData.phone_number,
        date_of_birth: formData.date_of_birth,
      };

      if (isEditMode && selectedTeacherId) {
        await axios.put(`/api/teachers/${selectedTeacherId}`, payload);
      } else {
        await axios.post("/api/teachers", payload);
      }

      fetchTeachers();
      closeModal();
    } catch (error) {
      console.error("Error saving teacher:", error);
    }
  };

  const handleDelete = async (teacherId: number) => {
    try {
      await axios.delete(`/api/teachers/${teacherId}`);
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openEditForm = (teacher: Teacher) => {
    setFormData({
      user_id: teacher.user_id,
      class_id: teacher.class_id,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      gender: teacher.gender,
      phone_number: teacher.phone_number,
      date_of_birth: teacher.date_of_birth,
    });
    setSelectedTeacherId(teacher.teacher_id);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchTeachers();
    fetchUsers();
    fetchClasses();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTeachers = teachers.filter((teacher) =>
    `${teacher.first_name} ${teacher.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-1">
      <div className="sm:flex">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <form className="lg:pr-3 " action="#" method="GET">
            <label className="sr-only">Search</label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="first name or last name"
                id="users-search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search for teachers..."
              />
            </div>
          </form>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <button
            onClick={() => setIsFormOpen(true)}
            type="button"
            data-modal-target="add-user-modal"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7]"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            Add Teacher
          </button>
          <a
            // onClick={exportUsersToExcel}
            className="inline-flex cursor-pointer items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
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
                      ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Class
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      First Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Last Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.teacher_id}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {teacher.teacher_id}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {teacher.class_id}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {teacher.first_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {teacher.last_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => openEditForm(teacher)}
                          className="inline-flex mr-1 items-center px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-primary-800"
                        >
                          <Pen /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.teacher_id)}
                          className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
                          Delete
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
        isOpen={isFormOpen}
        toggleModal={() => setIsFormOpen(false)}
        Content={
          <AddForm
            users={users}
            classes={classes}
            onSubmit={handleSubmit}
            onClose={() => setIsFormOpen(false)}
          />
        }
      />

      <Modal
        isOpen={isModalOpen}
        toggleModal={closeModal}
        Content={
          <EditForm
            users={users}
            classes={classes}
            onSubmit={handleSubmit}
            onClose={closeModal}
            formData={formData}
          />
        }
      />
    </div>
  );
};

export default TeacherManagementPage;

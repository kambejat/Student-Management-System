import React, { ChangeEvent, FormEvent } from "react";

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  role: string;
}

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

interface Class {
  id: number;
  name: string;
}

interface AddStudentProps {
  users: User[];
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  handleInputChange: any;
  formData: any;
  classes: Class[];
  isEditing: boolean;
  resetForm: () => void;
}

const AddStudent: React.FC<AddStudentProps> = ({
  users,
  handleSubmit,
  handleInputChange,
  formData,
  classes,
  resetForm,
  isEditing,
}) => {
  return (
    <>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-sm m-4 p-2 dark:bg-slate-900"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col mb-1">
            <label htmlFor="user_id" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Select User
            </label>
            <input
              list="users"
              name="user_id"
              value={formData.user_id}
              onChange={handleInputChange}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              required
              placeholder="Select User"
            />
            <datalist id="users">
              {users
                .filter((user) => user.role.toLocaleLowerCase() === "student")
                .map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
            </datalist>
          </div>

          <div className="flex flex-col mb-1">
            <label htmlFor="first_name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="First Name"
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              required
              readOnly
            />
          </div>

          <div className="flex flex-col mb-1">
            <label htmlFor="last_name" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Last Name"
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              required
              readOnly
            />
          </div>

          <div className="flex flex-col mb-1">
            <label htmlFor="date_of_birth" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              required
            />
          </div>

          <div className="flex flex-col mb-1">
            <label htmlFor="enrollment_year" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Enrollment Year
            </label>
            <input
              type="date"
              name="enrollment_year"
              value={formData.enrollment_year}
              onChange={handleInputChange}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              required
            />
          </div>

          <div className="flex flex-col mb-1">
            <label htmlFor="grade_level" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Grade Level
            </label>
            <select
              name="grade_level"
              value={formData.grade_level}
              onChange={handleInputChange}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
              required
            >
              <option value="">Select Grade</option>
              <option value="F1">F1</option>
              <option value="F2">F2</option>
              <option value="F3">F3</option>
              <option value="F4">F4</option>
            </select>
          </div>

          <div className="flex flex-col mb-1">
            <label htmlFor="class_id" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Class
            </label>
            <select
              name="class_id"
              value={formData.class_id}
              onChange={handleInputChange}
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
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

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={resetForm}
            className="mr-2 p-1 w-full bg-red-800 text-white rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="p-1 w-full bg-blue-800 text-white rounded"
          >
            {isEditing ? "Update" : "Add"} Student
          </button>
        </div>
      </form>
    </>
  );
};
export default AddStudent;

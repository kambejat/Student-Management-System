import React from "react";
import { Student } from "../../../types/types";

interface Parent {
  user_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

interface AddParentProps {
  students: Student[];
  handleParentSubmit: (e: React.FormEvent) => void;
  parent: Parent;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AddParent: React.FC<AddParentProps> = ({
  students,
  parent,
  handleParentSubmit,
  handleInputChange,
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Add Parent
      </h2>
      <form onSubmit={handleParentSubmit} className="space-y-6">
        {/* Student Input with Datalist */}
        <div>
          <label
            htmlFor="user_id"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Assign to Student
          </label>
          <input
            list="studentsList"
            id="user_id"
            name="user_id"
            value={parent.user_id}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Type or select a student"
            required
          />
          <datalist id="studentsList">
            {students.map((student) => (
              <option key={student.student_id} value={student.user_id}>
                {student.first_name} {student.last_name}
              </option>
            ))}
          </datalist>
        </div>

        {/* Parent First Name */}
        <div>
          <label
            htmlFor="first_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Parent First Name
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={parent.first_name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Parent Last Name */}
        <div>
          <label
            htmlFor="last_name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Parent Last Name
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={parent.last_name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Parent Phone Number */}
        <div>
          <label
            htmlFor="phone_number"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Parent Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={parent.phone_number}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Parent
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParent;
import React, { ChangeEvent, FormEvent } from "react";

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
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
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="user_id" className="mb-2 font-semibold">
              Select User
            </label>
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
            <label htmlFor="first_name" className="mb-2 font-semibold">
              First Name
            </label>
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
            <label htmlFor="last_name" className="mb-2 font-semibold">
              Last Name
            </label>
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
            <label htmlFor="date_of_birth" className="mb-2 font-semibold">
              Date of Birth
            </label>
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
            <label htmlFor="enrollment_year" className="mb-2 font-semibold">
              Enrollment Year
            </label>
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
            <label htmlFor="grade_level" className="mb-2 font-semibold">
              Grade Level
            </label>
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
            <label htmlFor="class_id" className="mb-2 font-semibold">
              Class
            </label>
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
    </>
  );
};
export default AddStudent;

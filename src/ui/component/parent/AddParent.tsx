import React from "react";
import { Student } from "../../../types/types";
interface Parent {
    userId: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }

interface AddParentProps {
  students: Student[];
  handleParentSubmit: (e: React.FormEvent) => void;
  parent: Parent;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const AddParent: React.FC<AddParentProps> = ({
  students,
  parent,
  handleParentSubmit,
  handleInputChange,
}) => {
  return (
    <>
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
    </>
  );
};

export default AddParent;

// TeacherModal.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { Class, FormData, User } from "../../../types/types";

interface TeacherModalProps {
  isEditMode: boolean;
  users: User[];
  classes: Class[];
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
  formData?: FormData; // This will be used when editing a teacher
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isEditMode,
  users,
  classes,
  onSubmit,
  onClose,
  formData = {
    user_id: "",
    class_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    date_of_birth: "",
  },
}) => {
  const [formState, setFormState] = useState<FormData>(formData);

  useEffect(() => {
    if (isEditMode && formData) {
      setFormState(formData);
    }
  }, [isEditMode, formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          {isEditMode ? "Edit Teacher" : "Add Teacher"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">User</label>
            <input
              list="users"
              name="user_id"
              value={formState.user_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <datalist id="users">
              {users.map((user) => (
                <option key={user.user_id} value={`${user.first_name} ${user.last_name}`} />
              ))}
            </datalist>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Class</label>
            <select
              name="class_id"
              value={formState.class_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <select
              name="gender"
              value={formState.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              value={formState.date_of_birth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone_number"
              value={formState.phone_number}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;

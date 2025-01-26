import React, { useState, useEffect, FormEvent } from "react";
import { User, Class, FormData } from "../../../types/types";

interface EditFormProps {
  users: User[];
  classes: Class[];
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
  formData: FormData; // Pre-filled form data for editing
}

const EditForm: React.FC<EditFormProps> = ({ users, classes, onSubmit, onClose, formData }) => {
  const [formState, setFormState] = useState<FormData>(formData);

  useEffect(() => {
    setFormState(formData);
  }, [formData]);

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
    <div className="">
      <div className="bg-white p-8 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Edit Teacher</h2>
        <form onSubmit={handleSubmit}>
          {/* User Selection */}
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
                <option key={user.user_id} value={user.user_id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </datalist>
          </div>

          {/* Class Selection */}
          <div className="mb-4">
            <label className="block text-gray-700">Class (Optional)</label>
            <select
              name="class_id"
              value={formState.class_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Gender */}
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

          {/* Date of Birth */}
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

          {/* Phone Number */}
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

         

          {/* Buttons */}
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

export default EditForm;

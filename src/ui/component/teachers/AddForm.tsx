import React, { useState, FormEvent } from "react";
import { User, Class, FormData } from "../../../types/types";

interface AddFormProps {
  users: User[];
  classes: Class[];
  onSubmit: (formData: FormData) => void;
  onClose: () => void;
}

const AddForm: React.FC<AddFormProps> = ({ users, classes, onSubmit, onClose }) => {
  const [formState, setFormState] = useState<FormData>({
    user_id: "",
    class_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    date_of_birth: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "user_id") {
      // Auto-fill first_name and last_name based on selected user_id
      const selectedUser = users.find((user: any) => String(user.user_id) === value);

      setFormState((prev: any) => ({
        ...prev,
        user_id: value,
        first_name: selectedUser?.first_name || "",
        last_name: selectedUser?.last_name || "",
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Create the final object to send to the database
    const formattedData = {
      ...formState,
    };

    onSubmit(formattedData);
    onClose();
  };

  return (
    <>
    <div className="bg-white h-64 p-8 rounded shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add Teacher</h2>
        <form onSubmit={handleSubmit} className="flex">
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
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="first_name"
              value={formState.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formState.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
              readOnly
            />
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
    </>
  );
};

export default AddForm;

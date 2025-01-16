import React from "react";

interface Role {
  role_id: number;
  name: string;
}

interface Permission {
  permission_id: number;
  name: string;
}

interface ModalData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string; // Add password to ModalData
  role: number;
  permissions: number[];
  confirmPassword?: string | undefined;
}

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: React.FormEvent) => void;
  modalData: ModalData;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handlePermissionChange: (permissionId: number) => void;
  roles: Role[];
  permissions: Permission[];
  isEditMode: boolean; // New prop to distinguish between add and edit
}
const UserForm: React.FC<UserFormProps> = ({
  isOpen,
  onClose,
  onSave,
  modalData,
  handleInputChange,
  handlePermissionChange,
  roles,
  permissions,
  isEditMode,
}) => {
  if (!isOpen) return null;

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();    
    if (!isEditMode) {
      // Reset permissions for new users
      modalData.permissions = [];
    }
    onSave(event); // Call the parent save handler
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-1 sm:p-4 rounded-md shadow-md w-full max-w-2xl mx-2">
        <div className="flex items-start justify-between p-2 border-b rounded-t dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-700 mb-1">
            {isEditMode ? "Edit User" : "Add User"}
          </h2>
        </div>
        <form className="p-2 space-y-2">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={modalData.username}
              onChange={handleInputChange}
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={modalData.email}
              onChange={handleInputChange}
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={modalData.first_name}
              onChange={handleInputChange}
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={modalData.last_name}
              onChange={handleInputChange}
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>

          {/* Password (only shown when adding a new user) */}
          {!isEditMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={modalData.password}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={modalData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                />
              </div>
            </>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white">
              Role
            </label>
            <select
              name="role"
              value={modalData.role}
              onChange={handleInputChange}
              required
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value={0}>Select a role</option>
              {roles.map((role) => (
                <option key={role.role_id} value={role.role_id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Permissions */}
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white">
                Permissions
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {permissions.map((perm) => (
                  <label key={perm.permission_id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={modalData.permissions.includes(
                        perm.permission_id
                      )}
                      onChange={() =>
                        handlePermissionChange(perm.permission_id)
                      }
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm">{perm.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
          {/* Action Buttons */}
          <div className="mt-1 flex justify-end items-center p-1 border-t border-gray-200 rounded-b dark:border-gray-700">
            
            <button
              onClick={handleSave}
              className="px-2 py-1 bg-indigo-700 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
            >
              {isEditMode ? "Save" : "Add"}
            </button>
            <button
              onClick={onClose}
              className="px-2 py-1 bg-red-600 ml-2 text-white rounded-md hover:bg-red-900 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;

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
  onSave: () => void;
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

  const handleSave = () => {
    if (!isEditMode) {
      // Reset permissions for new users
      modalData.permissions = [];
    }
    onSave(); // Call the parent save handler
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-md w-full max-w-2xl mx-2">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          {isEditMode ? "Edit User" : "Add User"}
        </h2>
        <form className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={modalData.username}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={modalData.email}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              value={modalData.first_name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              value={modalData.last_name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password (only shown when adding a new user) */}
          {!isEditMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={modalData.password}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={modalData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Role
            </label>
            <select
              name="role"
              value={modalData.role}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              <label className="block text-sm font-medium text-gray-600">
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
        </form>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
          >
            {isEditMode ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

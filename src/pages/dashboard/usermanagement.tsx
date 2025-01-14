import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "../../ui/component/usermanagement/form";

type User = {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string; // Only required for creating new users
  role: number; // Role ID
  permissions: number[]; // Array of permission IDs
  isActive: boolean;
};

type Role = {
  role_id: number;
  name: string;
};

type Permission = {
  permission_id: number;
  name: string;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditingUser, setIsEditingUser] = useState<boolean>(false); // New state for editing
  const [modalData, setModalData] = useState<
    Omit<User, "user_id"> & {
      user_id?: number;
      permissions: number[];
      confirmPassword?: string;
    }
  >({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "", // Add this
    role: 0,
    permissions: [],
    isActive: true,
  });

  useEffect(() => {
    // Fetch users, roles, and permissions
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes, permissionsRes] = await Promise.all([
          axios.get("/api/users"),
          axios.get("/api/roles"),
          axios.get("/api/permissions"),
        ]);

        setUsers(usersRes.data);
        setRoles(rolesRes.data);
        setPermissions(permissionsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setModalData((prev) => ({
      ...prev,
      [name]: name === "role" ? parseInt(value, 10) : value,
    }));
  };

  const handlePermissionChange = (permissionId: number) => {
    setModalData((prev) => {
      const permissions = prev.permissions || []; // Default to an empty array if undefined
      const updatedPermissions = permissions.includes(permissionId)
        ? permissions.filter((id) => id !== permissionId)
        : [...permissions, permissionId];
      return { ...prev, permissions: updatedPermissions };
    });
  };

  const openModal = (user?: User) => {
    setIsEditingUser(!!user); // Set isEditingUser based on whether user is passed
    setModalData(
      user
        ? {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            password: user.password,
            role: user.role,
            permissions: user.permissions || [],
            isActive: user.isActive,
          }
        : {
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            role: 0,
            permissions: [],
            confirmPassword: "",
            isActive: true,
          }
    );
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSaveUser = async () => {
    try {
      // Map role ID to role name
      const roleName = roles.find((role) => role.role_id === modalData.role)?.name;
  
      if (!roleName) {
        console.error("Role name not found for the selected role ID");
        return;
      }
  
      // Prepare the data for the POST or PUT request
      const requestData = {
        username: modalData.username,
        email: modalData.email,
        password: modalData.password || undefined, // Include password only for POST
        first_name: modalData.first_name, // Send first name
        last_name: modalData.last_name,   // Send last name
        role: roleName.toLowerCase(),    // Replace role ID with name
        isActive: modalData.isActive,    // Include isActive status
      };
  
      if (modalData.user_id) {
        // Update an existing user (PUT request)
        await axios.put(`/api/users/${modalData.user_id}`, {
          ...modalData,
          password: undefined, // Do not send the password when updating
        });
      } else {
        console.log(requestData)
        // Create a new user (POST request)
        await axios.post("/api/users", requestData);
      }
  
      // Refresh the users list
      const updatedUsers = await axios.get("/api/users");
      setUsers(updatedUsers.data);
      closeModal();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };
  

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <button
        onClick={() => openModal()}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
      >
        Add User
      </button>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">First Name</th>
              <th className="border border-gray-300 px-4 py-2">Last Name</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return (
                <tr key={user.user_id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {user.user_id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.username}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.first_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.last_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {user.role}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.user_id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <UserForm
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveUser}
        modalData={modalData}
        handleInputChange={handleInputChange}
        handlePermissionChange={handlePermissionChange}
        roles={roles}
        permissions={permissions}
        isEditMode={isEditingUser}
      />
    </div>
  );
};

export default UserManagement;

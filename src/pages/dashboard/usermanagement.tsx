import React, { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "../../ui/component/usermanagement/form";
import { AddIcon, DeleteIcon, ExportIcon, Pen } from "../../ui/icon/icons";
import { User } from "../../types/types";

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

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) =>
    `${user.first_name} ${user.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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

  const handleSaveUser = async (event: React.FormEvent) => {
    event.preventDefault(); 
    
    try {
      // Map role ID to role name
      const roleName = roles.find(
        (role) => role.role_id === modalData.role
      )?.name;
  
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
        last_name: modalData.last_name, // Send last name
        role: roleName.toLowerCase(), // Replace role ID with name
        isActive: modalData.isActive, // Include isActive status
      };
  
      if (modalData.user_id) {
        // Update an existing user (PUT request)
        await axios.put(`/api/users/${modalData.user_id}`, {
          ...modalData,
          password: undefined, // Do not send the password when updating
        });
      } else {
        console.log(requestData);
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

  const exportUsersToExcel = async () => {
    try {
      // Make a GET request to the Flask endpoint with the export query parameter
      const response = await axios.get("/api/users", {
        params: { export: "true" }, // Ensure the `export` query parameter is set to true
        responseType: "blob", // Expect a binary response
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Generate a URL for the Blob
      const url = URL.createObjectURL(blob);
      const now = new Date();
      const options: any = { year: "numeric", month: "long", day: "numeric" };
      const timestamp = `${now
        .toLocaleDateString("en-US", options)
        .replace(
          / /g,
          "_"
        )}_${now.getHours()}${now.getMinutes()}${now.getSeconds()}`;

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${timestamp}.xlsx`; // File name for the downloaded file
      document.body.appendChild(a);
      a.click(); // Programmatically click the anchor to trigger the download
      document.body.removeChild(a); // Remove the anchor from the document

      // Release the Blob URL after use
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting users to Excel:", error);
      alert("Failed to export users. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col p-2">
      <div className="sm:flex">
        <div className="items-center hidden mb-3 sm:flex sm:divide-x sm:divide-gray-100 sm:mb-0 dark:divide-gray-700">
          <form className="lg:pr-3 " action="#" method="GET">
            <label className="sr-only">Search</label>
            <div className="relative mt-1 lg:w-64 xl:w-96">
              <input
                type="text"
                name="first name or last name"
                id="users-search"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Search for users"
              />
            </div>
          </form>
        </div>
        <div className="flex items-center ml-auto space-x-2 sm:space-x-3">
          <button
            onClick={() => openModal()}
            type="button"
            data-modal-target="add-user-modal"
            data-modal-toggle="add-user-modal"
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-[#311fb7] focus:ring-4 focus:ring-[#98a5ff] sm:w-auto dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-[#311fb7]"
          >
            <AddIcon className="mr-2 -ml-1 h-5 w-5" />
            Add user
          </button>
          <a
            onClick={exportUsersToExcel}
            className="inline-flex items-center justify-center w-1/2 px-2 py-1 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
          >
            <ExportIcon />
            Export
          </a>
        </div>
      </div>
      <div className="flex flex-col pt-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      ID
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Username
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Email
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      First Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Last Name
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Role
                    </th>
                    <th className="p-2 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
                      Status
                    </th>
                    <th className="p-2 text-xs text-center font-medium text-gray-500 uppercase dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.user_id}
                      className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
                    >
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {user.user_id}
                      </td>
                      <td className="p-2 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.username}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="p-2 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.first_name}
                      </td>
                      <td className="p-2 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {user.last_name}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        {user.role}
                      </td>
                      <td className="p-2 text-base font-normal text-gray-500 dark:text-gray-400">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            user.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                          title={user.isActive ? "Active" : "Inactive"}
                        ></span>
                      </td>
                      <td className="p-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => openModal(user)}
                          className="inline-flex mr-1 items-center px-2 py-1 text-sm font-medium text-center text-white rounded-md bg-[#3b22e0] hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-[#3b22e0] dark:focus:ring-primary-800"
                        >
                          <Pen /> <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="inline-flex items-center px-2 py-1 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                        >
                          <DeleteIcon /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

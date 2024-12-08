import React, { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";

interface UserProps {
  user_id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  created_at: string;
}

interface AuthContextProps {
  user: UserProps | null;
  token: string | null;
  loginUser: (loginData: LoginDataProps) => Promise<void>;
  registerUser: (registerData: RegisterDataProps) => Promise<void>;
  updateUser: (userId: number, updateData: Partial<UserProps>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  fetchUsers: () => Promise<UserProps[]>;
  logoutUser: () => void;
}

interface LoginDataProps {
  username: string;
  password: string;
}

interface RegisterDataProps {
  username: string;
  password: string;
  role: string;
  email: string;
  isActive: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<UserProps | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const loginUser = async (loginData: LoginDataProps) => {
    try {
      const response = await axios.post("/api/login", loginData);
      const { access_token, refresh_token } = response.data;
      localStorage.setItem("token", access_token);
      setToken(access_token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  const registerUser = async (registerData: RegisterDataProps) => {
    try {
      const response = await axios.post("/api/users", registerData);
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const fetchUsers = async (): Promise<UserProps[]> => {
    try {
      const response = await axios.get("/api/users");
      return response.data;
    } catch (error: any) {
      toast.error("Failed to fetch users");
      return [];
    }
  };

  const updateUser = async (userId: number, updateData: Partial<UserProps>) => {
    try {
      await axios.patch(`/api/users/${userId}`, updateData);
      toast.success("User updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update user");
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      toast.success("User deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete user");
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/login");
  };

  const contextData: AuthContextProps = {
    user,
    token,
    loginUser,
    registerUser,
    updateUser,
    deleteUser,
    fetchUsers,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
      <ToastContainer />
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

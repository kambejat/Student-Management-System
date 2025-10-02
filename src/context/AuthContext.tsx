import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";

interface UserProps {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions?: string[];
  isActive: boolean;
  createdAt: string;
}

interface AuthContextProps {
  user: UserProps | null;
  token: string | null;
  loginUser: (loginData: LoginDataProps, rememberMe: boolean) => Promise<void>;
  registerUser: (registerData: RegisterDataProps) => Promise<void>;
  updateUser: (userId: number, updateData: Partial<UserProps>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  fetchUsers: () => Promise<UserProps[]>;
  logoutUser: () => void;
  fieldErrors: Record<string, string>;
  setFieldErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isServerError: string | boolean;
  setIsServerError: React.Dispatch<React.SetStateAction<string | boolean>>;
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

interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: UserProps;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

function setUserObject(user: any): UserProps | null {
  if (!user) return null;
  return {
    userId: user.userId,
    username: user.username,
    email: user.email,
    roles: user.roles || [],
    permissions: user.permissions || [],
    isActive: user.isActive,
    createdAt: user.createdAt,
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    return storedToken ? storedToken : null;
  });
  const [user, setUser] = useState<UserProps | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isServerError, setIsServerError] = useState<string | boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedData) {
      const authData: any = storedData; // Parse the stored data
      setToken(authData.accessToken);
      setUser(authData.user);
    }
  }, []);
  
  const loginUser = async (loginData: LoginDataProps, rememberMe: boolean) => {
    try {
      const response = await axios.post("/api/login", loginData);
      const userInfo = response.data.user_info;
  
      const authData = {
        accessToken: userInfo.access_token,
        refreshToken: userInfo.refresh_token,
        user: setUserObject(userInfo),
      };
  
      if (rememberMe) {
        localStorage.setItem("token", JSON.stringify(authData));
      } else {
        sessionStorage.setItem("token", JSON.stringify(authData));
      }
  
      setToken(authData.accessToken);
      setUser(authData.user);
  
      // Retrieve the last active tab or default to the first tab
      const lastActiveTab = localStorage.getItem("activeTab") || "1";
      navigate(`/dashboard/${lastActiveTab}/1`);
  
      toast.success(response.data.message || "Login successful");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  };
  
  const registerUser = async (registerData: RegisterDataProps) => {
    try {
      const response = await axios.post("/api/users", registerData);
      toast.success(response.data.message || "Registration successful!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
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
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    toast.info("Logged out successfully");
    navigate("/");
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
    fieldErrors,
    setFieldErrors,
    isServerError,
    setIsServerError,
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

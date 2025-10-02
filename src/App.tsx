import React, { useState } from "react";
import "./App.css";
import useAuth from "./context/useAuth";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import PrivateRoute from "./context/PrivateRoute";
import Login from "./pages/Login";
import SignupForm from "./pages/SignUp";
import axios from "axios";
import MenuContent from "./ui/nav/MenuContent";
import Sidebar from "./ui/nav/Sidebar";
import Navbar from "./ui/nav/Navbar";
import StudentPortal from "./pages/portal/portal";

axios.defaults.baseURL = "http://127.0.0.1:5000";

const App: React.FC = () => {
  const [user] = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<number>(1);
  const navigate = useNavigate();

  const handleTabChange = (tabNumber: number) => {
    if (activeTab !== tabNumber) {
      setActiveTab(tabNumber);
      localStorage.setItem("activeTab", String(tabNumber)); 
      navigate(`/dashboard/${tabNumber}/1`);
    }
  };
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={!user ? <Login />: <Navigate to={"dashboard/6/1"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupForm />} />
        <Route
          path="/dashboard/:tabNumber/:pageNumber"
          element={
            <PrivateRoute>
              {user ? (
                <>
                <Navbar toggleSidebar={toggleSidebar} handleTabChange={handleTabChange}/>
                <Sidebar 
                activeTab={activeTab}
                isSidebarOpen={isSidebarOpen}
                handleTabChange={handleTabChange}
                />
                  <main className="  dark:bg-[#0e2f3e] bg-white sm:ml-64">
                    <div className="p-2 border dark:bg-gray-900 shadow-sm border-solid rounded-sm dark:border-gray-700 mt-14">
                      <MenuContent activeTab={activeTab} />
                    </div>
                  </main>
                </>
              ) : (
                <>Not Found Page</>
              )}
            </PrivateRoute>
          }
        />
        <Route path="/portal" element={<StudentPortal />} />
      </Routes>
    </>
  );
};

export default App;

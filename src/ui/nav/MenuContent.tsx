import React from "react";
import Home from "../../pages/dashboard";
import StudentManagement from "../../pages/dashboard/students";
import ParentManagement from "../../pages/dashboard/parents";
import TeacherManagementPage from "../../pages/dashboard/teachers";
import AccountManagement from "../../pages/dashboard/accounts";
import SubjectsPage from "../../pages/dashboard/subjects";
import UserManagement from "../../pages/dashboard/usermanagement";

interface MenuContentProps {
  activeTab: number;
}

const MenuContent: React.FC<MenuContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    if (activeTab === 1) {
      return <Home />;
    } else if (activeTab === 2) {
      return (
        <>
          <StudentManagement />
        </>
      );
    } else if (activeTab === 3) {
      return (
        <>
          <ParentManagement />
        </>
      );
    } else if (activeTab === 4) {
      return (
        <>
          <TeacherManagementPage />
        </>
      );
    } else if (activeTab === 5) {
      return (
        <>
          <AccountManagement />
        </>
      );
    } else if (activeTab === 6) {
      // Add more pages for other tabs here
      return (
        <>
          <SubjectsPage />
        </>
      );
    } else if (activeTab === 7) {
      return (
        <>
          <UserManagement />
        </>
      );
    } else {
      return (
        <>
          <div className="bg-gray-100">
            <div className="h-screen flex flex-col justify-center items-center">
              <h1 className="text-8xl font-bold text-gray-800">404</h1>
              <p className="text-4xl font-medium text-gray-800">
                Page Not Found
              </p>
              <a
                href="/dasboard/1/1"
                className="mt-4 text-xl text-blue-600 hover:underline"
              >
                Go back home
              </a>
            </div>
          </div>
        </>
      );
    }
  };
  return renderContent();
};

export default MenuContent;

import React from "react";
import Home from "../../pages/dashboard";
import StudentManagement from "../../pages/dashboard/students";
import ParentManagement from "../../pages/dashboard/parents";
import TeacherManagementPage from "../../pages/dashboard/teachers";
import AccountManagement from "../../pages/dashboard/accounts";
import SubjectsPage from "../../pages/dashboard/subjects";
import UserManagement from "../../pages/dashboard/usermanagement";
import Breadcrumb from "../Breadcrumb";

interface MenuContentProps {
  activeTab: number;
}

const MenuContent: React.FC<MenuContentProps> = ({ activeTab }) => {
  // Map activeTab to breadcrumb navigation
  const breadcrumbMap: any = {
    1: [{ label: "Home" }],
    2: [
      { label: "Home", href: "/dashboard" },
      { label: "Student Management" },
    ],
    3: [
      { label: "Home", href: "/dashboard" },
      { label: "Parent Management" },
    ],
    4: [
      { label: "Home", href: "/dashboard" },
      { label: "Teacher Management" },
    ],
    5: [
      { label: "Home", href: "/dashboard" },
      { label: "Account Management" },
    ],
    6: [
      { label: "Home", href: "/dashboard" },
      { label: "Subjects" },
    ],
    7: [
      { label: "Home", href: "/dashboard" },
      { label: "User Management" },
    ],
  };

  const navigation = breadcrumbMap[activeTab] || [
    { label: "Home", href: "/dashboard" },
    { label: "404 - Page Not Found" },
  ];

  const renderContent = () => {
    if (activeTab === 1) {
      return <Home />;
    } else if (activeTab === 2) {
      return <StudentManagement />;
    } else if (activeTab === 3) {
      return <ParentManagement />;
    } else if (activeTab === 4) {
      return <TeacherManagementPage />;
    } else if (activeTab === 5) {
      return <AccountManagement />;
    } else if (activeTab === 6) {
      return <SubjectsPage />;
    } else if (activeTab === 7) {
      return <UserManagement />;
    } else {
      return (
        <div className="bg-gray-100">
          <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-8xl font-bold text-gray-800">404</h1>
            <p className="text-4xl font-medium text-gray-800">
              Page Not Found
            </p>
            <a
              href="/dashboard/1/1"
              className="mt-4 text-xl text-blue-600 hover:underline"
            >
              Go back home
            </a>
          </div>
        </div>
      );
    }
  };

  return (
    <Breadcrumb navigation={navigation}>
      {renderContent()}
    </Breadcrumb>
  );
};

export default MenuContent;

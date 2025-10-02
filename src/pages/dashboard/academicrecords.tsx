import React, { useState } from "react";
import GradesPage from "../../ui/component/academicrecods/grades/GradesPage";

const AcademicRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"grades" | "subjects" | "reports">(
    "grades"
  );

  const handleTabClick = (tab: "grades" | "subjects" | "reports") => {
    setActiveTab(tab);
  };

  return (
    <div className="container mx-auto p-1">
      {/* Tabs */}
      <div className="space-x-1 flex text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <div className="flex flex-wrap -mb-px space-x-1">
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "grades"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("grades")}
          >
            Grades
          </button>
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "subjects"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("subjects")}
          >
            Subjects
          </button>
          <button
            className={`py-1 px-2 rounded ${
              activeTab === "reports"
                ? "text-blue-600 border-b-2 border-blue-600 rounded-t-md active dark:text-blue-500 dark:border-blue-500"
                : "bg-gray-200"
            }`}
            onClick={() => handleTabClick("reports")}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "grades" && (
        <div className="mt-1">
          <GradesPage />
        </div>
      )}

      {activeTab === "subjects" && (
        <div className="mt-1">
          
        </div>
      )}

      {activeTab === "reports" && (
        <div className="mt-1">
          
        </div>
      )}
    </div>
  );
};

export default AcademicRecords;

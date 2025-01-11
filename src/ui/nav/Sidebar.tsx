import React, { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { StudentIcon } from "../icon/icons";

interface SidebarProps {
    activeTab: number;
    handleTabChange: (tabNumber: number) => void;
    isSidebarOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    handleTabChange,
    isSidebarOpen
}) => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        return null; // or return a fallback UI
    }

    const activeTabClass = "border-l-4 dark:border-blue-700 border-[#e01e4a] bg-[#fff1f2] dark:bg-[#fecdd3] dark:text-white";
    const activeIconTextClass = "text-[#f34060] dark:text-white"; // Adjust the colors as needed

    return(
        <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 shadow-lg border-r dark:border-none w-64 pt-14 h-screen bg-[#39337c] transition-transform ${
          isSidebarOpen ? "-translate-x-full sm:translate-x-0" : ""
        }`}
        aria-label="Sidebar"
      >
         <div className="h-full px-3 py-4 overflow-y-auto dark:bg-gray-800">
         <ul className="space-y-2 font-medium">
            <li
            className={`${activeTab === 1? activeTabClass : ""} flex items-center rounded-sm p-2 space-x-3 hover:bg-[#db3d3d] dark:hover:bg-[#168677] dark:hover:text-white`}
            onClick={() => handleTabChange(1)}
            >
                <svg className={`w-5 h-5  ${activeTab === 1? activeIconTextClass : "text-white"}`} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
                <span className={`text-sm ${activeTab === 1 ? "dark:text-[#d11544]  text-[#d11544]" : "text-white"}`}>Dashboard</span>
            </li>
            {/* Students */}
            <li
            className={`${activeTab === 2? activeTabClass : ""} flex items-center rounded-sm p-2 space-x-3 hover:bg-[#db3d3d] dark:hover:bg-[#168677] dark:hover:text-white`}
            onClick={() => handleTabChange(2)}
            >
               <StudentIcon className={` ${activeTab === 2? activeIconTextClass : "text-white"}`} />
                <span className={`text-sm ${activeTab === 2 ? "dark:text-[#d11544]  text-[#d11544]" : "text-white"}`}>Students</span>
            </li>
         </ul>
         </div>
      </aside>
    )
}

export default Sidebar;
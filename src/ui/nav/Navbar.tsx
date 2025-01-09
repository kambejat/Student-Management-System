import React, { useContext, useState, useEffect, useRef } from "react";
import AuthContext from "../../context/AuthContext";
import useAuth from "../../context/useAuth";
import useDarkSide from "../../hooks/useDarkSide";
import { Link } from "react-router-dom";

interface SidebarProps {
  toggleSidebar: () => void;
  handleTabChange: (tabNumber: number) => void;
}

const Navbar: React.FC<SidebarProps> = ({ toggleSidebar, handleTabChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [colorTheme, setTheme] = useDarkSide();
  const [darkSide, setDarkSide] = useState(
    colorTheme === "light" ? true : false
  );
  const authContext = useContext(AuthContext);
  const [user] = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  if (!authContext) {
    return null; // or return a fallback UI
  }

  const { logoutUser } = authContext;

  const handleLogout = () => {
    logoutUser();
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleDarkModeToggle = () => {
    setTheme(colorTheme);
    setDarkSide(!darkSide);
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 z-50 w-full shadow-sm bg-[#39337c] border-gray-200" dark:bg-gray-800`}
      >
        <div className="px-2 py-2 lg:px-1 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  ></path>
                </svg>
              </button>
              <Link
                to="/dashboard"
                className="flex items-center  text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <img className="w-10 h-10" alt="Logo" />{" "}
              </Link>
              <span className="self-center italic text-green-700 text-lg font-semibold sm:text-lg whitespace-nowrap dark:text-white">
                StdSyS
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3 relative">
                user information
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, MessageCircle } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-blur bg-opacity-40 md:hidden z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen md:h-auto min-h-full w-56 bg-gray-800 text-white flex flex-col z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold p-4 border-b border-gray-700 flex justify-between items-center">
          Smart Expense Tracker App
          {/* Close button on mobile */}
          <button
            onClick={toggleSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </h2>

        <nav className="flex-1 overflow-y-auto">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 p-4 hover:bg-gray-700 transition ${
              location.pathname === "/dashboard" ? "bg-gray-700" : ""
            }`}
            onClick={toggleSidebar}
          >
            <Home size={20} /> Dashboard
          </Link>

          <Link
            to="/chatbot"
            className={`flex items-center gap-2 p-4 hover:bg-gray-700 transition ${
              location.pathname === "/chatbot" ? "bg-gray-700" : ""
            }`}
            onClick={toggleSidebar}
          >
            <MessageCircle size={20} /> ChatBot
          </Link>

          <Link
            to="/account"
            className={`flex items-center gap-2 p-4 hover:bg-gray-700 transition ${
              location.pathname === "/account" ? "bg-gray-700" : ""
            }`}
            onClick={toggleSidebar}
          >
            <User size={20} /> Account
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, MessageCircle } from "lucide-react"; // Added ChatBot icon

const Sidebar = () => {
  const location = useLocation(); // To highlight active page

  return (
    <div className="w-56 h-screen bg-gray-800 text-white flex flex-col">
      <h2 className="text-2xl font-bold p-4 border-b border-gray-700">
        Smart Expense App
      </h2>

      <Link
        to="/dashboard"
        className={`flex items-center gap-2 p-4 hover:bg-gray-700 transition ${
          location.pathname === "/dashboard" ? "bg-gray-700" : ""
        }`}
      >
        <Home size={20} /> Dashboard
      </Link>

      <Link
        to="/chatbot"
        className={`flex items-center gap-2 p-4 hover:bg-gray-700 transition ${
          location.pathname === "/chatbot" ? "bg-gray-700" : ""
        }`}
      >
        <MessageCircle size={20} /> ChatBot
      </Link>

      <Link
        to="/account"
        className={`flex items-center gap-2 p-4 hover:bg-gray-700 transition ${
          location.pathname === "/account" ? "bg-gray-700" : ""
        }`}
      >
        <User size={20} /> Account
      </Link>
    </div>
  );
};

export default Sidebar;

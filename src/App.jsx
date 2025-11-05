import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/SideBar";
import Dashboard from "./Components/Dashboard";
import ChatBot from "./Components/ChatBot";
import Account from "./Components/Account";
import Authentication from "./Components/Authentication";
import { ToastContainer } from "react-toastify";
import ForgetPass from "./Components/ForgetPass";
import ChangePassword from "./Components/ChangePassword";

const isLoggedIn = () => !!localStorage.getItem("userId");

const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} theme="light" />
      <Router>
        <Routes>
          <Route path="/auth" element={<Authentication />} />
          <Route path="/forget" element={<ForgetPass />} />
          <Route path="/changePass" element={<ChangePassword />} />

          <Route
            path="/*"
            element={
              isLoggedIn() ? (
                <div className="flex min-h-screen bg-gray-100">
                  {/* Sidebar with toggle */}
                  <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                  {/* Main Content */}
                  <div className="flex-1 relative p-4 md:p-6">
                    {/* ☰ Menu button visible only on mobile */}
                    <button
                      onClick={toggleSidebar}
                      className="md:hidden text-2xl absolute top-4 left-4 bg-gray-800 text-white p-2 rounded"
                    >
                      ☰
                    </button>

                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/chatbot"
                        element={
                          <ProtectedRoute>
                            <ChatBot />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/account"
                        element={
                          <ProtectedRoute>
                            <Account />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </div>
                </div>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;

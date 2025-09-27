import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/SideBar";
import Dashboard from "./Components/Dashboard";
import ChatBot from "./Components/ChatBot";
import Account from "./Components/Account";
import Authentication from "./Components/Authentication";
import {ToastContainer} from 'react-toastify'
// Helper: check if user is logged in
const isLoggedIn = () => !!localStorage.getItem("userId");

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  return isLoggedIn() ? children : <Navigate to="/auth" replace />;
};

const App = () => {
  return (
    <>
  <ToastContainer
        position="top-right"
        autoClose={2000} // Close after 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false} // Right-to-left support
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // Add a transition effect
      />
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/auth" element={<Authentication />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            isLoggedIn() ? (
              <div className="flex">
                <Sidebar />
                <div className="flex-1 p-6">
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

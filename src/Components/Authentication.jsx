import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Authentication = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState("form"); // form | otp
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Send OTP or Login/Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // ---- LOGIN ----
      try {
        const res = await fetch(
          "https://smart-expense-tracker-server-2.onrender.com/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("userId", data.user.id);
          toast.success("Login successful");
          setTimeout(() => (window.location.href = "/dashboard"), 1500);
        } else toast.error(data.message);
      } catch {
        toast.error("Server error");
      }
    } else {
      // ---- REGISTER: STEP 1 → SEND OTP ----
      try {
        const res = await fetch("http://localhost:3030/otp/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        const data = await res.json();

        if (res.ok) {
          toast.success("OTP sent to your email");
          setStep("otp"); // move to OTP screen
        } else toast.error(data.message);
      } catch (err) {
        toast.error("Unable to send OTP");
      }
    }
  };

  // 🔹 Verify OTP & Create User
  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:3030/otp/verify-otp/${formData.email}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: formData.otp }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // ---- REGISTER USER AFTER OTP VERIFIED ----
        const res1 = await fetch(
          "https://smart-expense-tracker-server-2.onrender.com/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }),
          }
        );

        const data1 = await res1.json();
        if (res1.ok) {
          toast.success("Registration successful");
          localStorage.setItem("userId", data1.user.id);
          setTimeout(() => (window.location.href = "/dashboard"), 1500);
        } else {
          toast.error(data1.message);
        }
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("OTP validation failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {step === "form" ? (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">
              {isLogin ? "Login" : "Register"}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? "🔒" : "👀"}
                </button>
              </div>

              {/* 🔹 Show "Forget Password" only when login */}
              {isLogin && (
                <div className="text-right">
                  <Link
                    to="/forget"
                    className="text-blue-500 text-sm hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
              )}

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
              >
                {isLogin ? "Login" : "Send OTP"}
              </button>
            </form>

            <p className="text-center mt-4 text-gray-600 cursor-pointer">
              {isLogin
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                className="text-blue-500 hover:underline cursor-pointer"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setStep("form");
                }}
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </>
        ) : (
          // 🔹 OTP Screen
          <>
            <h2 className="text-2xl font-bold mb-6 text-center">Verify OTP</h2>
            <form onSubmit={handleOtpVerify} className="flex flex-col gap-4">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer"
              >
                Verify OTP
              </button>
            </form>

            <p className="text-center mt-4 text-gray-600">
              Didn’t get OTP?{" "}
              <button
                className="text-blue-500 hover:underline"
                onClick={() => handleSubmit(new Event("resend"))}
              >
                Resend
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Authentication;

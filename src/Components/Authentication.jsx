import React, { useState } from "react";
import { toast } from "react-toastify";

const Authentication = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login & register
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const[showPassword,setShowPassword]=useState(false)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "https://smart-expense-tracker-server-1.onrender.com/auth/login"
      : "https://smart-expense-tracker-server-1.onrender.com/auth/register";

    const bodyData = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
       
        // store userId in localStorage
        localStorage.setItem("userId", data.user.id);
        // Optionally redirect to dashboard
        const msg = isLogin ? "Login" : "Register";
        toast.success(msg + " successfully");
      setTimeout(() => {
  window.location.href = "/dashboard";
}, 1500);
       
      } else {
        toast.success(data.message || "Error occurred");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
            {showPassword ? "🔒" : "👀"}
        </button>
    </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600 cursor-pointer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Authentication;

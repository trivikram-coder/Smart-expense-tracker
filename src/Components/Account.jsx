import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const Account = () => {
  const storedUserId = localStorage.getItem("userId"); // get logged-in user ID
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data
  useEffect(() => {
    if (!storedUserId) return setLoading(false);

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://smart-expense-tracker-server-726b.onrender.com/auth/user/${storedUserId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFormData({ name: data.name, email: data.email });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [storedUserId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update user info
  const handleUpdate = async () => {
    const { name, email } = formData;

    // Basic validation
    if (!name.trim() || !email.trim()) {
      setError("Name and email cannot be empty");
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      const res = await fetch(`https://smart-expense-tracker-server-726b.onrender.com/auth/user/${storedUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        setEditMode(false);
        setError("");
      } else {
        setError("Update failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("userId");
    toast.success("You logged out")
     // clear stored user
    setUser(null);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center max-w-md mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <p>You are not logged in.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Account Info</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-2">
        <strong>Name:</strong>{" "}
        {editMode ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        ) : (
          user.name
        )}
      </div>

      <div className="mb-2">
        <strong>Email:</strong>{" "}
        {editMode ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 w-full"
          />
        ) : (
          user.email
        )}
      </div>

      <div className="mb-2">
        <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
      </div>

      {editMode ? (
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Save
          </button>
          <button
            onClick={() => {
              setEditMode(false);
              setFormData({ name: user.name, email: user.email });
              setError("");
            }}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;

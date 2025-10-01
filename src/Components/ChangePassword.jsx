import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const storedUserId = localStorage.getItem("userIdForgetPass");
    const [showPassword, setShowPassword] = useState(false);

    // Password must be at least 8 characters, include uppercase, lowercase, number, and special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
console.log(storedUserId)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordRegex.test(newPassword)) {
            toast.error("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password not matched");
            return;
        }

        try {
            const response = await fetch(`https://smart-expense-tracker-server-1.onrender.com/auth/user/${storedUserId}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: confirmPassword })
            });
            if (response.status === 200) {
                localStorage.removeItem("userIdForgetPass")
                toast.success("Password changed successfully");
                navigate("/auth");
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 border border-gray-200 rounded-lg bg-gray-50 shadow">
            <h2 className="text-2xl font-semibold text-center mb-6">Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4 relative">
                    <label className="block mb-2 font-medium">New Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-xl text-gray-500 hover:text-gray-700 cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPassword ? "🔒" : "👀"}
                        </button>
                    </div>
                    <small className="text-gray-500 block mt-1">
                        Must be 8+ chars, include uppercase, lowercase, number, and special character.
                    </small>
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;

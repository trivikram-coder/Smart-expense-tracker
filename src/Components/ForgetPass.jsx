import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgetPass = () => {
    const [showOtp, setShowOtp] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async () => {
        if (!email) {
            toast.error('Please enter email address');
            return;
        }

        try {
            const response = await fetch("https://email-service-72rh.onrender.com/otp/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });

            const res = await response.json();

            if (response.status === 200) {
                toast.success(res.message || "OTP sent successfully");
                setShowOtp(true);
            } else {
                toast.error(res.message || "Failed to send OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error sending OTP");
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }

        setIsVerifying(true);
        try {
            const response = await fetch(`https://email-service-72rh.onrender.com/otp/verify-otp/${email}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ otp })
            });

            const res = await response.json();

            if (response.status === 200) {
                toast.success(res.message || "OTP verified successfully");
                // Store email for next step
                localStorage.setItem("emailForgetPass", email);
                navigate("/changePass");
            } else {
                toast.error(res.message || "Invalid OTP");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error verifying OTP");
        }
        setIsVerifying(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Forget Password</h2>
                <p className="text-gray-700 mb-6 text-center">
                    Enter your email address to receive a verification code
                </p>

                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {showOtp ? (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                            <button
                                className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer"
                                onClick={handleVerifyOtp}
                                disabled={isVerifying}
                            >
                                {isVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                        </>
                    ) : (
                        <button
                            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition cursor-pointer"
                            onClick={handleSendCode}
                        >
                            Send Code
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgetPass;

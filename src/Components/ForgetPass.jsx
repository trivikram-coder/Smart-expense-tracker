import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgetPass = () => {
    const [showOtp, setShowOtp] = useState(false);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate=useNavigate()
    const handleSendCode = async () => {
        if (!email) {
            toast.error('Please enter email address');
            return;
        }
        setShowOtp(true);
        try {
            const response = await fetch("http://localhost:3000/otps/sendotp", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            const res = await response.json();
            if (response.status === 201) {
                toast.success(res.message || "OTP sent successfully");
                localStorage.setItem("userIdForgetPass",res.userId)
            } else {
                toast.error(res.message || "Failed to send OTP");
            }
        } catch (error) {
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
            const response = await fetch("http://localhost:3000/otps/validateotp", {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify( { otp})
            });
            const res = await response.json();
            if (response.status === 200) {
                toast.success(res.message || "OTP verified successfully");
                // You can redirect or show reset password form here
                
                navigate("/changePass")
            } else {
                toast.error(res.message || "Invalid OTP");
            }
        } catch (error) {
            toast.error("Error verifying OTP");
        }
        setIsVerifying(false);
    };

    const handleOtpChange = (e) => setOtp(e.target.value);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Forget password</h2>
                <h2 className="text-xl font-normal mb-6 text-center">
                    Enter your email address to send verification code
                </h2>
                <div className="flex flex-col gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {showOtp && (
                        <>
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                className="border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={otp}
                                onChange={handleOtpChange}
                            />
                            <button
                                className="bg-green-500 text-white py-2 rounded hover:bg-green-600 transition cursor-pointer"
                                onClick={handleVerifyOtp}
                                disabled={isVerifying}
                            >
                                {isVerifying ? "Verifying..." : "Verify OTP"}
                            </button>
                        </>
                    )}
                    {!showOtp && (
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

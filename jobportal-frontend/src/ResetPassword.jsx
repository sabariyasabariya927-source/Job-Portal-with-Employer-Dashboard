
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!token) {
            setMessage("Invalid or missing reset link.");
            return;
        }

        if (newPassword.length < 8) {
            setMessage("Password must contain at least 8 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://job-portal-with-employer-dashboard-q1kn.onrender.com/api/users/reset-password",
                {
                    token: token,
                    newPassword: newPassword
                }
            );

            setMessage(response.data.message);

            setTimeout(() => navigate("/login"), 2000);

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Password reset failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-left">
                    <div className="overlay">
                        <h1>Job Portal</h1>
                        <p>
                            Create a new password.
                            <br />
                            Secure your account.
                        </p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-box">
                        <h1>Reset Password</h1>

                        <p className="login-subtitle">
                            Enter your new password.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="password"
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>

                        {message && <p>{message}</p>}

                        <button
                            type="button"
                            className="login-button"
                            onClick={() => navigate("/login")}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function ForgotPassword() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://job-portal-with-employer-dashboard-q1kn.onrender.com/api/users/forgot-password",
                { email }
            );

            setMessage(response.data.message);
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to send reset email. Please try again."
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
                            Reset your password.
                            <br />
                            Get back to your account.
                        </p>
                    </div>
                </div>

                <div className="login-right">
                    <div className="login-box">
                        <h1>Password Reset</h1>

                        <p className="login-subtitle">
                            Enter your registered email address.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;

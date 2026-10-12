
import { useNavigate } from "react-router-dom";
import "./Login.css";

function ForgotPassword() {
    const navigate = useNavigate();

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
                            Secure password reset is temporarily unavailable.
                        </p>

                        <p>
                            Please contact the administrator for help
                            resetting your account password.
                        </p>

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

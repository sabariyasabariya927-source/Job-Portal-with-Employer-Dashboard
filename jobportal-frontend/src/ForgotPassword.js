import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {

      const res = await axios.post(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/users/forgot-password",
        {
          email: email,
          newPassword: newPassword
        }
      );

      if (res.data.success) {
        alert("Password reset successfully");
        navigate("/");
      }
      else {
        alert(res.data.message);
      }

    } catch (error) {

      console.error("Forgot password error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          "Password reset failed"
        );
      }
      else {
        alert("Backend connection failed");
      }
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

            <h1>Reset Password</h1>

            <p className="login-subtitle">
              Enter your email and create a new password
            </p>

            <form onSubmit={handleReset}>

              <div className="input-group">

                <span>📧</span>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

              <div className="input-group">

                <span>🔒</span>

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

              </div>

              <div className="input-group">

                <span>🔒</span>

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

              </div>

              <button
                type="submit"
                className="login-button"
              >
                Reset Password
              </button>

            </form>

            <div
              className="forgot-password"
              onClick={() => navigate("/")}
            >
              Back to Login
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;
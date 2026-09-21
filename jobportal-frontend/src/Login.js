import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/users/login",
        {
          email: email,
          password: password
        }
      );

      console.log("Backend response:", res.data);

      if (res.data.success) {

        const role = res.data.role.toUpperCase();

        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        localStorage.setItem("isLoggedIn", "true");

        if (role === "ADMIN") {
          navigate("/admin-dashboard");
        }
        else if (role === "EMPLOYER") {
          navigate("/employer-dashboard");
        }
        else if (role === "JOBSEEKER") {
          navigate("/seeker-dashboard");
        }
        else {
          alert("Unknown user role");
        }

      } else {
        alert(res.data.message);
      }

    } catch (error) {

      console.error("Login error:", error);

      if (error.response) {
        alert(
          "Login failed: " +
          (error.response.data.message || "Invalid email or password")
        );
      } else {
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
              Find your dream job.
              <br />
              Build your career.
            </p>
          </div>
        </div>

        <div className="login-right">

          <div className="login-box">

            <h1>Welcome</h1>

            <p className="login-subtitle">
              Log in to your account to continue
            </p>

            <form onSubmit={handleSubmit}>

              <div className="input-group">

                <span>👤</span>

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
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

              </div>

              <div
                className="forgot-password"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot your password?
              </div>

              <button
                type="submit"
                className="login-button"
              >
                Log In
              </button>

            </form>

            <p className="signup-text">
              Don't have an account?
              <span> Sign up!</span>
            </p>

            <div className="social-icons">
              <span>f</span>
              <span>𝕏</span>
              <span>in</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;
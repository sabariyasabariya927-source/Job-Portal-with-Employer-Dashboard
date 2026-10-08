import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {

      const res = await axios.post(
"http://localhost:8081/api/users/login" ,       
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

        alert(
          res.data.message || "Login failed"
        );

      }

    } catch (error) {

      console.error("Login error:", error);

      if (error.response) {

        alert(
          "Login failed: " +
          (
            error.response.data.message ||
            "Invalid email or password"
          )
        );

      } else {

        alert("Backend connection failed");

      }
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* LEFT SIDE */}

        <div className="login-left">

          <div className="overlay">

            <h1>Job Portal</h1>

            <p>
              Find your dream job and connect
              with the right opportunities.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="login-right">

          <div className="login-box">

            <h1>Welcome</h1>

            <p className="login-subtitle">
              Log in to your account to continue
            </p>

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="input-group">

                <span>👤</span>

                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

              </div>

              {/* PASSWORD */}

              <div className="password-container">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {/* FORGOT PASSWORD */}

              <div
                className="forgot-password"
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                Forgot your password?
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className="login-button"
              >
                Log In
              </button>

            </form>

            {/* SIGN UP */}

            <p className="signup-text">

              Don't have an account?

              <span
                onClick={() =>
                  navigate("/register")
                }
              >
                {" "}Sign up!
              </span>

            </p>

            {/* SOCIAL ICONS */}

            <div className="social-icons">

              <span>f</span>

              <span>♥</span>

              <span>in</span>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("JOBSEEKER");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!name.trim() || !email.trim() || !password) {
            alert("Please fill all fields");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                "https://job-portal-backend-932n.onrender.com/api/users/register",
                {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 30000
                }
            );

            if (res.data?.success) {
                alert(
                    "Registration successful!\n\nPlease check your email and click the verification link."
                );

                navigate("/login");
            } else {
                alert(res.data?.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);

            if (error.response) {
                const data = error.response.data;

                const message =
                    typeof data === "string"
                        ? data
                        : data?.message ||
                          `Registration failed (${error.response.status})`;

                alert(message);
            } else if (error.code === "ECONNABORTED") {
                alert("Request timed out. Please try again.");
            } else {
                alert(
                    "Cannot connect to the backend. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Create Account</h2>

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="JOBSEEKER">Job Seeker</option>
                        <option value="EMPLOYER">Employer</option>
                    </select>

                    <button type="submit" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p>
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default Register;

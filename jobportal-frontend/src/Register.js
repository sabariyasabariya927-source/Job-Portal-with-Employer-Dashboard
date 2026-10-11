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

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            alert("Please fill all fields");
            return;
        }

        try {

            const res = await axios.post(
"https://job-portal-backend-932n.onrender.com/api/users/register", {
                    name: name,
                    email: email,
                    password: password,
                    role: role
                }
            );

            if (res.data.success) {

                alert(
                    "Registration successful!\n\nPlease check your email and click the verification link."
                );

                navigate("/login");

            } else {

                alert(
                    res.data.message || "Registration failed"
                );
            }

        } catch (error) {

            console.error("Registration error:", error);

            if (error.response) {

                alert(
                    error.response.data.message ||
                    "Registration failed"
                );

            } else {

                alert("Backend connection failed");
            }
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
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="JOBSEEKER">
                            Job Seeker
                        </option>

                        <option value="EMPLOYER">
                            Employer
                        </option>
                    </select>

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p>
                    Already have an account?

                    <button
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
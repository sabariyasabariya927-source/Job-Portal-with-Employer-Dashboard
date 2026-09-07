import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("jobseeker");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/users/register",
                {
                    name: name,
                    email: email,
                    password: password,
                    role: role
                }
            );

            alert("Registration successful!");

            navigate("/login");

        } catch (error) {

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Registration failed"
                );
            } else {
                alert("Backend server is not running");
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
                        <option value="jobseeker">
                            Job Seeker
                        </option>

                        <option value="employer">
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
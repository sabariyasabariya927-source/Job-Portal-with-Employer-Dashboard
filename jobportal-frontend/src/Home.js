import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (
        <div>

            <div className="home-container">

                <h1>Welcome to Job Portal</h1>

                <p>
                    Find your dream job and build your career.
                </p>

                <div className="home-buttons">

                    <button onClick={() => navigate("/jobs")}>
                        Browse Jobs
                    </button>

                    <button onClick={() => navigate("/login")}>
                        Login
                    </button>

                    <button onClick={() => navigate("/register")}>
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Home;
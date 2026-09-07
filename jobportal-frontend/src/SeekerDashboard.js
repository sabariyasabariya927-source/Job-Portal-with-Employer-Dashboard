import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SeekerDashboard() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/jobs"
      );

      setJobs(response.data);
      setLoading(false);

    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
      alert("Unable to load jobs");
    }
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <div style={{ padding: "30px" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <div>
          <h1>Job Seeker Dashboard</h1>
          <p>Welcome, {email}</p>
        </div>

        <button onClick={logout}>
          Logout
        </button>

      </div>

      <hr />

      {/* Menu */}
      <div style={{ marginTop: "20px" }}>

        <button
          onClick={() => navigate("/seeker-dashboard")}
          style={{ marginRight: "10px" }}
        >
          Home
        </button>

        <button
          onClick={() => alert("My Applications coming soon")}
          style={{ marginRight: "10px" }}
        >
          My Applications
        </button>

        <button
          onClick={() => alert("My Resume coming soon")}
        >
          My Resume
        </button>

      </div>

      <hr />

      {/* Available Jobs */}
      <h2>Available Jobs</h2>

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No jobs available.</p>
      ) : (

        <div>

          {jobs.map((job) => (

            <div
              key={job.jobID}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                marginBottom: "15px",
                borderRadius: "8px"
              }}
            >

              <h3>{job.title}</h3>

              <p>
                <b>Description:</b> {job.description}
              </p>

              <p>
                <b>Location:</b> {job.location}
              </p>

              <p>
                <b>Salary:</b> {job.salary}
              </p>

              <p>
                <b>Job Type:</b> {job.jobType}
              </p>

              <button
                onClick={() =>
                  alert("Apply Job feature coming next")
                }
              >
                Apply Job
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default SeekerDashboard;
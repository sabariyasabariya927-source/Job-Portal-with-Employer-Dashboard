import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/jobs"
      );

      console.log("JOBS:", response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("JOB API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <Sidebar activePage="Jobs" onLogout={handleLogout} />

      <div style={{ marginLeft: "240px", minHeight: "100vh" }}>

        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px 30px",
            borderBottom: "1px solid #ddd"
          }}
        >
          <h1 style={{ margin: 0, color: "#17232d" }}>
            Jobs
          </h1>

          <p style={{ margin: "5px 0 0", color: "#777" }}>
            Manage available job postings
          </p>
        </div>

        <div style={{ padding: "30px" }}>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "30px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <p style={{ margin: 0, color: "#777" }}>
              💼 Total Jobs
            </p>

            <h2
              style={{
                margin: "10px 0 0",
                fontSize: "32px"
              }}
            >
              {jobs.length}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              💼 Available Jobs
            </h2>

            <p style={{ color: "#777" }}>
              All jobs posted in JobPortal
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f2f4" }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>JOB TITLE</th>
                    <th style={thStyle}>DESCRIPTION</th>
                    <th style={thStyle}>LOCATION</th>
                    <th style={thStyle}>SALARY</th>
                    <th style={thStyle}>JOB TYPE</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#777"
                        }}
                      >
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.jobID}>
                        <td style={tdStyle}>
                          #{job.jobID}
                        </td>

                        <td style={tdStyle}>
                          <strong>{job.title}</strong>
                        </td>

                        <td style={tdStyle}>
                          {job.description}
                        </td>

                        <td style={tdStyle}>
                          📍 {job.location}
                        </td>

                        <td style={tdStyle}>
                          ₹{job.salary}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor: "#e8f0fe",
                              color: "#3157a4",
                              padding: "6px 12px",
                              borderRadius: "15px",
                              fontSize: "13px",
                              fontWeight: "bold"
                            }}
                          >
                            {job.jobType || "Not Specified"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "14px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  fontSize: "13px"
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee"
};

export default Jobs;
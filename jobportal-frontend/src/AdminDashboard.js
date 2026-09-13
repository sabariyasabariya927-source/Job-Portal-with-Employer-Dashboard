import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchApplications();
  }, []);

  // USERS
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/users"
      );
      console.log("USERS FROM BACKEND:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("USER API ERROR:", error);
    }
  };

  // JOBS
  const fetchJobs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/jobs"
      );
      console.log("JOBS FROM BACKEND:", response.data);
      setJobs(response.data);
    } catch (error) {
      console.error("JOB API ERROR:", error);
    }
  };

  // APPLICATIONS
  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/applications"
      );
      console.log("APPLICATIONS FROM BACKEND:", response.data);
      setApplications(response.data);
    } catch (error) {
      console.error("APPLICATION API ERROR:", error);
    }
  };

  // DELETE APPLICATION
  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:8081/api/applications/${id}`
      );

      alert("Application deleted successfully!");
      fetchApplications();
    } catch (error) {
      console.error("DELETE APPLICATION ERROR:", error);
      alert("Failed to delete application.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "/";
  };

  // GET JOB TITLE
  const getJobTitle = (jobID) => {
    const job = jobs.find((job) => job.jobID === jobID);
    return job ? job.title : "Unknown Job";
  };

  // GET SEEKER NAME
  const getSeekerName = (seekerID) => {
    const seeker = users.find((user) => user.id === seekerID);
    return seeker ? seeker.name : "Unknown User";
  };

  // DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "Not available";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "Not available";
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* SIDEBAR */}
      <Sidebar
        activePage="Dashboard"
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT */}
      <div
        style={{
          marginLeft: "240px",
          minHeight: "100vh"
        }}
      >
        {/* HEADER */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ddd"
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "#17232d"
              }}
            >
              Admin Dashboard
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                color: "#777"
              }}
            >
              Manage your JobPortal system
            </p>
          </div>

          <div>
            <span
              style={{
                marginRight: "20px",
                color: "#555"
              }}
            >
              Welcome, {email}
            </span>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef5350",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div style={{ padding: "30px" }}>

          {/* STAT CARDS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
              marginBottom: "30px"
            }}
          >
            <div style={cardStyle}>
              <p style={labelStyle}>👥 Total Users</p>
              <h2 style={numberStyle}>{users.length}</h2>
              <small>Registered users</small>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>💼 Total Jobs</p>
              <h2 style={numberStyle}>{jobs.length}</h2>
              <small>Available jobs</small>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>📄 Applications</p>
              <h2 style={numberStyle}>{applications.length}</h2>
              <small>Job applications</small>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>🏢 Companies</p>
              <h2 style={numberStyle}>1</h2>
              <small>Registered companies</small>
            </div>
          </div>

          {/* JOBS */}
          <div style={sectionStyle}>
            <h2>💼 Jobs List</h2>

            <p style={{ color: "#777" }}>
              Recently available job opportunities
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f2f4" }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>JOB TITLE</th>
                    <th style={thStyle}>LOCATION</th>
                    <th style={thStyle}>SALARY</th>
                    <th style={thStyle}>JOB TYPE</th>
                    <th style={thStyle}>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        style={{
                          padding: "20px",
                          textAlign: "center"
                        }}
                      >
                        No jobs available
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.jobID}>
                        <td style={tdStyle}>
                          #{job.jobID}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            💼 {job.title}
                          </strong>
                          <br />
                          <small style={{ color: "#888" }}>
                            Job opportunity
                          </small>
                        </td>

                        <td style={tdStyle}>
                          📍 {job.location}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            ₹{job.salary}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {job.jobType || "Not specified"}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor: "#d9f5e5",
                              color: "#198754",
                              padding: "5px 12px",
                              borderRadius: "20px",
                              fontSize: "13px"
                            }}
                          >
                            Active
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* APPLICATIONS */}
          <div style={sectionStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px"
              }}
            >
              <div>
                <h2 style={{ marginBottom: "5px" }}>
                  📄 Applications
                </h2>

                <p
                  style={{
                    color: "#777",
                    marginTop: 0
                  }}
                >
                  Applications received from job seekers
                </p>
              </div>

              <span
                style={{
                  backgroundColor: "#e8f0fe",
                  color: "#3157a4",
                  padding: "8px 15px",
                  borderRadius: "20px",
                  fontWeight: "bold"
                }}
              >
                {applications.length} Applications
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f2f4" }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>JOB</th>
                    <th style={thStyle}>SEEKER</th>
                    <th style={thStyle}>RESUME</th>
                    <th style={thStyle}>APPLIED DATE</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={thStyle}>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {applications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#777"
                        }}
                      >
                        No applications found
                      </td>
                    </tr>
                  ) : (
                    applications.map((application) => (
                      <tr
                        key={application.applicationID}
                      >
                        <td style={tdStyle}>
                          <strong>
                            #{application.applicationID}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            💼{" "}
                            {getJobTitle(
                              application.jobID
                            )}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          👤{" "}
                          {getSeekerName(
                            application.seekerID
                          )}
                        </td>

                        <td style={tdStyle}>
                          📄 Resume #
                          {application.resumeID}
                        </td>

                        <td style={tdStyle}>
                          📅{" "}
                          {formatDate(
                            application.appliedDate
                          )}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor:
                                application.status ===
                                "Under Review"
                                  ? "#fff3cd"
                                  : application.status ===
                                    "Rejected"
                                  ? "#f8d7da"
                                  : "#d9f5e5",

                              color:
                                application.status ===
                                "Under Review"
                                  ? "#856404"
                                  : application.status ===
                                    "Rejected"
                                  ? "#842029"
                                  : "#198754",

                              padding: "6px 13px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "bold"
                            }}
                          >
                            {application.status}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              deleteApplication(
                                application.applicationID
                              )
                            }
                            style={{
                              backgroundColor: "#ef5350",
                              color: "white",
                              border: "none",
                              padding: "7px 12px",
                              borderRadius: "5px",
                              cursor: "pointer",
                              fontSize: "12px"
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* USERS */}
          <div style={sectionStyle}>
            <h2>👥 Registered Users</h2>

            <p style={{ color: "#777" }}>
              Users registered in the job portal
            </p>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f2f4" }}>
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>NAME</th>
                    <th style={thStyle}>EMAIL</th>
                    <th style={thStyle}>ROLE</th>
                    <th style={thStyle}>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={tdStyle}>
                        #{user.id}
                      </td>

                      <td style={tdStyle}>
                        <strong>{user.name}</strong>
                      </td>

                      <td style={tdStyle}>
                        {user.email}
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            backgroundColor: "#e8f0fe",
                            color: "#3157a4",
                            padding: "5px 10px",
                            borderRadius: "15px",
                            fontSize: "13px"
                          }}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            backgroundColor: "#d9f5e5",
                            color: "#198754",
                            padding: "5px 12px",
                            borderRadius: "20px",
                            fontSize: "13px"
                          }}
                        >
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <footer
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#777"
            }}
          >
            © 2026 JobPortal — Admin Dashboard
          </footer>

        </div>
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const labelStyle = {
  color: "#777",
  margin: 0
};

const numberStyle = {
  fontSize: "32px",
  margin: "10px 0"
};

const sectionStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  marginBottom: "30px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

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

export default AdminDashboard;
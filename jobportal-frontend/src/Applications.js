import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const [applicationsRes, jobsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8081/api/applications"),
        axios.get("http://localhost:8081/api/jobs"),
        axios.get("http://localhost:8081/api/users")
      ]);

      setApplications(applicationsRes.data);
      setJobs(jobsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("APPLICATION API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getJobTitle = (jobID) => {
    const job = jobs.find((job) => job.jobID === jobID);
    return job ? job.title : "Unknown Job";
  };

  const getSeekerName = (seekerID) => {
    const user = users.find((user) => user.id === seekerID);
    return user ? user.name : "Unknown User";
  };

  const handleDelete = async (applicationID) => {
    if (!window.confirm("Delete this application?")) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8081/api/applications/${applicationID}`
      );

      alert("Application deleted successfully!");

      setApplications(
        applications.filter(
          (app) => app.applicationID !== applicationID
        )
      );
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Failed to delete application");
    }
  };

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
      <Sidebar
        activePage="Applications"
        onLogout={handleLogout}
      />

      <div style={{ marginLeft: "240px", minHeight: "100vh" }}>

        {/* Header */}
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "20px 30px",
            borderBottom: "1px solid #ddd"
          }}
        >
          <h1 style={{ margin: 0, color: "#17232d" }}>
            Applications
          </h1>

          <p style={{ margin: "5px 0 0", color: "#777" }}>
            Manage job applications
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "30px" }}>

          {/* Total Applications */}
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
              📄 Total Applications
            </p>

            <h2
              style={{
                margin: "10px 0 0",
                fontSize: "32px"
              }}
            >
              {applications.length}
            </h2>
          </div>

          {/* Applications Table */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              📄 Job Applications
            </h2>

            <p style={{ color: "#777" }}>
              All applications submitted by job seekers
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
                    <th style={thStyle}>JOB</th>
                    <th style={thStyle}>SEEKER</th>
                    <th style={thStyle}>RESUME ID</th>
                    <th style={thStyle}>STATUS</th>
                    <th style={thStyle}>APPLIED DATE</th>
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
                    applications.map((app) => (
                      <tr key={app.applicationID}>

                        <td style={tdStyle}>
                          #{app.applicationID}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {getJobTitle(app.jobID)}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {getSeekerName(app.seekerID)}
                        </td>

                        <td style={tdStyle}>
                          #{app.resumeID}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor:
                                app.status === "Under Review"
                                  ? "#fff3cd"
                                  : "#d9f5e5",
                              color:
                                app.status === "Under Review"
                                  ? "#856404"
                                  : "#198754",
                              padding: "6px 12px",
                              borderRadius: "15px",
                              fontSize: "13px",
                              fontWeight: "bold"
                            }}
                          >
                            {app.status}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          {app.appliedDate
                            ? app.appliedDate
                            : "Not Available"}
                        </td>

                        <td style={tdStyle}>
                          <button
                            onClick={() =>
                              handleDelete(app.applicationID)
                            }
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "7px 12px",
                              borderRadius: "5px",
                              cursor: "pointer"
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

export default Applications;
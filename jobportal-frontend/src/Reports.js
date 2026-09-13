import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Reports() {
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  const fetchReports = async () => {
    try {
      const [usersRes, jobsRes, applicationsRes, companiesRes] =
        await Promise.all([
          axios.get("http://localhost:8081/api/users"),
          axios.get("http://localhost:8081/api/jobs"),
          axios.get("http://localhost:8081/api/applications"),
          axios.get("http://localhost:8081/api/companies")
        ]);

      setUsers(usersRes.data);
      setJobs(jobsRes.data);
      setApplications(applicationsRes.data);
      setCompanies(companiesRes.data);
    } catch (error) {
      console.error("REPORT API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchReports();
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
      <Sidebar
        activePage="Reports"
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
            Reports
          </h1>

          <p style={{ margin: "5px 0 0", color: "#777" }}>
            JobPortal system reports and statistics
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "30px" }}>

          {/* Summary Cards */}
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
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>💼 Total Jobs</p>
              <h2 style={numberStyle}>{jobs.length}</h2>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>📄 Applications</p>
              <h2 style={numberStyle}>
                {applications.length}
              </h2>
            </div>

            <div style={cardStyle}>
              <p style={labelStyle}>🏢 Companies</p>
              <h2 style={numberStyle}>
                {companies.length}
              </h2>
            </div>

          </div>

          {/* Report Summary */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              📊 System Summary
            </h2>

            <p style={{ color: "#777" }}>
              Current JobPortal system statistics
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse"
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f2f4" }}>
                  <th style={thStyle}>REPORT</th>
                  <th style={thStyle}>COUNT</th>
                  <th style={thStyle}>STATUS</th>
                </tr>
              </thead>

              <tbody>

                <tr>
                  <td style={tdStyle}>
                    Registered Users
                  </td>
                  <td style={tdStyle}>
                    <strong>{users.length}</strong>
                  </td>
                  <td style={tdStyle}>
                    <span style={activeStyle}>
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style={tdStyle}>
                    Job Postings
                  </td>
                  <td style={tdStyle}>
                    <strong>{jobs.length}</strong>
                  </td>
                  <td style={tdStyle}>
                    <span style={activeStyle}>
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style={tdStyle}>
                    Job Applications
                  </td>
                  <td style={tdStyle}>
                    <strong>{applications.length}</strong>
                  </td>
                  <td style={tdStyle}>
                    <span style={activeStyle}>
                      Active
                    </span>
                  </td>
                </tr>

                <tr>
                  <td style={tdStyle}>
                    Registered Companies
                  </td>
                  <td style={tdStyle}>
                    <strong>{companies.length}</strong>
                  </td>
                  <td style={tdStyle}>
                    <span style={activeStyle}>
                      Active
                    </span>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
};

const labelStyle = {
  margin: 0,
  color: "#777"
};

const numberStyle = {
  margin: "10px 0 0",
  fontSize: "32px"
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

const activeStyle = {
  backgroundColor: "#d9f5e5",
  color: "#198754",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold"
};

export default Reports;
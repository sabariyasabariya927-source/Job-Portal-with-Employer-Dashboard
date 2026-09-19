import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Companies() {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/companies"
      );

      console.log("COMPANIES:", response.data);
      setCompanies(response.data);
    } catch (error) {
      console.error("COMPANY API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
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
        activePage="Companies"
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
            Companies
          </h1>

          <p style={{ margin: "5px 0 0", color: "#777" }}>
            Manage registered companies
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "30px" }}>

          {/* Total Companies */}
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
              🏢 Total Companies
            </p>

            <h2
              style={{
                margin: "10px 0 0",
                fontSize: "32px"
              }}
            >
              {companies.length}
            </h2>
          </div>

          {/* Companies Table */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              🏢 Registered Companies
            </h2>

            <p style={{ color: "#777" }}>
              All companies registered in JobPortal
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
                    <th style={thStyle}>COMPANY NAME</th>
                    <th style={thStyle}>DESCRIPTION</th>
                    <th style={thStyle}>CATEGORY ID</th>
                    <th style={thStyle}>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {companies.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#777"
                        }}
                      >
                        No companies found
                      </td>
                    </tr>
                  ) : (
                    companies.map((company) => (
                      <tr key={company.companyID}>

                        <td style={tdStyle}>
                          #{company.companyID}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {company.companyName}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {company.companyDescription ||
                            "No description available"}
                        </td>

                        <td style={tdStyle}>
                          #{company.categoryID}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor: "#d9f5e5",
                              color: "#198754",
                              padding: "6px 12px",
                              borderRadius: "20px",
                              fontSize: "13px",
                              fontWeight: "bold"
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

export default Companies;
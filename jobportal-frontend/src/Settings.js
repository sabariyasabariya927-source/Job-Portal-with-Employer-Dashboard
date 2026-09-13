import React from "react";
import Sidebar from "./Sidebar";

function Settings() {
  const email = localStorage.getItem("email") || "admin@gmail.com";
  const role = localStorage.getItem("role") || "ADMIN";

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
        activePage="Settings"
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
            Settings
          </h1>

          <p style={{ margin: "5px 0 0", color: "#777" }}>
            Manage administrator account settings
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "30px" }}>

          {/* Profile */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "25px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              👤 Administrator Profile
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: "15px",
                marginTop: "20px"
              }}
            >
              <strong>Name</strong>
              <span>Administrator</span>

              <strong>Email</strong>
              <span>{email}</span>

              <strong>Role</strong>
              <span>
                <span style={roleStyle}>
                  {role}
                </span>
              </span>

              <strong>Status</strong>
              <span>
                <span style={activeStyle}>
                  Active
                </span>
              </span>
            </div>
          </div>

          {/* Account Information */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "25px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              ⚙️ Account Information
            </h2>

            <p style={{ color: "#777" }}>
              Current administrator account information
            </p>

            <div
              style={{
                padding: "15px",
                backgroundColor: "#f5f7fa",
                borderRadius: "8px",
                marginTop: "15px"
              }}
            >
              <p style={{ margin: "5px 0" }}>
                <strong>Login Status:</strong> Logged In
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>Access Level:</strong> Administrator
              </p>

              <p style={{ margin: "5px 0" }}>
                <strong>System:</strong> JobPortal
              </p>
            </div>
          </div>

          {/* Security */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              🔐 Security
            </h2>

            <p style={{ color: "#777" }}>
              Your administrator account is currently active.
            </p>

            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🚪 Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const roleStyle = {
  backgroundColor: "#e8f0fe",
  color: "#3157a4",
  padding: "6px 12px",
  borderRadius: "15px",
  fontSize: "13px",
  fontWeight: "bold"
};

const activeStyle = {
  backgroundColor: "#d9f5e5",
  color: "#198754",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold"
};

export default Settings;
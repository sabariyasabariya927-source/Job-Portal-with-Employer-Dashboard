import React from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({ activePage = "Dashboard" }) {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: "🏠", path: "/admin-dashboard" },
    { name: "Users", icon: "👥", path: "/users" },
    { name: "Jobs", icon: "💼", path: "/jobs" },
    { name: "Applications", icon: "📄", path: "/applications" },
    { name: "Companies", icon: "🏢", path: "/companies" },
    { name: "Reports", icon: "📊", path: "/reports" },
    { name: "Settings", icon: "⚙️", path: "/settings" }
  ];

  const handleMenuClick = (item) => {
    navigate(item.path);
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
        width: "240px",
        minHeight: "100vh",
        backgroundColor: "#17232d",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 10px rgba(0,0,0,0.15)"
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #2d3d4b"
        }}
      >
        <h2 style={{ margin: 0 }}>
          💼 JobPortal
        </h2>

        <p
          style={{
            margin: "5px 0 0",
            fontSize: "12px",
            color: "#b8c1c8"
          }}
        >
          Administration Panel
        </p>
      </div>

      {/* Admin */}
      <div
        style={{
          padding: "15px",
          borderBottom: "1px solid #2d3d4b"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "#5b4be7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px"
            }}
          >
            👤
          </div>

          <div>
            <strong style={{ fontSize: "13px" }}>
              Administrator
            </strong>

            <div
              style={{
                fontSize: "11px",
                color: "#65d68a"
              }}
            >
              ● Online
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ padding: "20px 10px" }}>
        <p
          style={{
            fontSize: "10px",
            color: "#71808c",
            fontWeight: "bold",
            margin: "0 0 10px 5px"
          }}
        >
          MAIN MENU
        </p>

        {menuItems.map((item) => (
          <div
            key={item.name}
            onClick={() => handleMenuClick(item)}
            style={{
              padding: "10px 12px",
              marginBottom: "5px",
              borderRadius: "6px",
              cursor: "pointer",
              backgroundColor:
                activePage === item.name
                  ? "#2d3d4b"
                  : "transparent",
              color:
                activePage === item.name
                  ? "white"
                  : "#b8c1c8",
              fontWeight:
                activePage === item.name
                  ? "bold"
                  : "normal",
              transition: "0.2s",
              display: "flex",
              alignItems: "center"
            }}
          >
            <span
              style={{
                marginRight: "12px",
                fontSize: "15px"
              }}
            >
              {item.icon}
            </span>

            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div
        style={{
          marginTop: "auto",
          padding: "15px"
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
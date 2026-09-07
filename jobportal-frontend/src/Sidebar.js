import React from "react";

function Sidebar({ activePage = "Dashboard" }) {

  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Users", icon: "👥" },
    { name: "Jobs", icon: "💼" },
    { name: "Applications", icon: "📄" },
    { name: "Companies", icon: "🏢" },
    { name: "Reports", icon: "📊" },
    { name: "Settings", icon: "⚙️" }
  ];

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

      {/* LOGO */}

      <div
        style={{
          padding: "25px 20px",
          borderBottom: "1px solid #2d3a44"
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px"
          }}
        >
          💼 JobPortal
        </h2>

        <p
          style={{
            margin: "6px 0 0",
            color: "#aeb8c0",
            fontSize: "13px"
          }}
        >
          Administration Panel
        </p>
      </div>

      {/* ADMIN PROFILE */}

      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid #2d3a44",
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >

        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: "#4f46e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px"
          }}
        >
          👤
        </div>

        <div>
          <strong
            style={{
              display: "block",
              fontSize: "14px"
            }}
          >
            Administrator
          </strong>

          <span
            style={{
              color: "#8fd3a8",
              fontSize: "12px"
            }}
          >
            ● Online
          </span>
        </div>

      </div>

      {/* MENU */}

      <div
        style={{
          padding: "20px 12px",
          flex: 1
        }}
      >

        <p
          style={{
            color: "#71808c",
            fontSize: "11px",
            fontWeight: "bold",
            padding: "0 12px",
            marginBottom: "12px",
            letterSpacing: "1px"
          }}
        >
          MAIN MENU
        </p>

        {menuItems.map((item) => (

          <div
            key={item.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
              padding: "12px 14px",
              marginBottom: "5px",
              borderRadius: "7px",
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

              transition: "0.2s"
            }}
          >

            <span
              style={{
                fontSize: "17px"
              }}
            >
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </div>

        ))}

      </div>

      {/* LOGOUT */}

      <div
        style={{
          padding: "15px 12px",
          borderTop: "1px solid #2d3a44"
        }}
      >

        <button
          onClick={handleLogout}
          style={{
            width: "100%",
            padding: "12px",
            border: "none",
            borderRadius: "7px",
            backgroundColor: "#ef5350",
            color: "white",
            cursor: "pointer",
            fontSize: "14px",
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
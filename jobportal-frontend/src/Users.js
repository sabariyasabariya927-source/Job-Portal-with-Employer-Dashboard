import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";

function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/users"
      );

      console.log("USERS:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("USER API ERROR:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
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
      {/* SIDEBAR */}
      <Sidebar
        activePage="Users"
        onLogout={handleLogout}
      />

      {/* MAIN AREA */}
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
            borderBottom: "1px solid #ddd"
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#17232d"
            }}
          >
            Users
          </h1>

          <p
            style={{
              margin: "5px 0 0",
              color: "#777"
            }}
          >
            Manage registered users
          </p>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "30px" }}>
          {/* USER COUNT */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              marginBottom: "30px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#777"
              }}
            >
              👥 Total Registered Users
            </p>

            <h2
              style={{
                margin: "10px 0 0",
                fontSize: "32px"
              }}
            >
              {users.length}
            </h2>
          </div>

          {/* USERS TABLE */}
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "25px",
              borderRadius: "10px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              👥 Registered Users
            </h2>

            <p style={{ color: "#777" }}>
              All users registered in JobPortal
            </p>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse"
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f0f2f4"
                    }}
                  >
                    <th style={thStyle}>ID</th>
                    <th style={thStyle}>NAME</th>
                    <th style={thStyle}>EMAIL</th>
                    <th style={thStyle}>ROLE</th>
                    <th style={thStyle}>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          padding: "30px",
                          textAlign: "center",
                          color: "#777"
                        }}
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td style={tdStyle}>
                          #{user.id}
                        </td>

                        <td style={tdStyle}>
                          <strong>
                            {user.name}
                          </strong>
                        </td>

                        <td style={tdStyle}>
                          {user.email}
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor:
                                "#e8f0fe",
                              color: "#3157a4",
                              padding: "6px 12px",
                              borderRadius: "15px",
                              fontSize: "13px",
                              fontWeight: "bold"
                            }}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <span
                            style={{
                              backgroundColor:
                                "#d9f5e5",
                              color: "#198754",
                              padding: "6px 12px",
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

export default Users;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import SeekerDashboard from "./SeekerDashboard";

function EmployerDashboard() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Employer Dashboard</h1>
      <p>Welcome Employer!</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        {/* Employer */}
        <Route
          path="/employer-dashboard"
          element={<EmployerDashboard />}
        />

        {/* Job Seeker */}
        <Route
          path="/seeker-dashboard"
          element={<SeekerDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import ForgotPassword from "./ForgotPassword";

import AdminDashboard from "./AdminDashboard";
import EmployerDashboard from "./EmployerDashboard";
import SeekerDashboard from "./SeekerDashboard";
import Users from "./Users";
import Jobs from "./Jobs";
import Applications from "./Applications";
import Companies from "./Companies";
import Reports from "./Reports";
import Settings from "./Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />

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
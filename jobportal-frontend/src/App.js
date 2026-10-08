import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
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

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route path="/users" element={<Users />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route
          path="/applications"
          element={<Applications />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        <Route
          path="/employer-dashboard"
          element={<EmployerDashboard />}
        />

        <Route
          path="/seeker-dashboard"
          element={<SeekerDashboard />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
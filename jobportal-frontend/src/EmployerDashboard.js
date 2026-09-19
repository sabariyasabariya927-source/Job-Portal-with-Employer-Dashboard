import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jobsResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/jobs"
      );

      const applicationsResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/applications"
      );

      const usersResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/users"
      );

      const resumesResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/resumes"
      );

      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
      setUsers(usersResponse.data);
      setResumes(resumesResponse.data);

    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
  };

  const getJobTitle = (jobID) => {
    const job = jobs.find((job) => job.jobID === jobID);

    return job ? job.title : "Unknown Job";
  };

  const getApplicantName = (seekerID) => {
    const user = users.find((user) => user.id === seekerID);

    return user ? user.name : "Unknown Applicant";
  };

  const getResume = (seekerID) => {
    return resumes.find(
      (resume) => resume.seekerID === seekerID
    );
  };

  const viewResume = (seekerID) => {
    const resume = getResume(seekerID);

    if (resume) {
      setSelectedResume(resume);
    } else {
      alert("Resume not found!");
    }
  };

  const getStatusCount = (status) => {
    return applications.filter(
      (application) => application.status === status
    ).length;
  };

  const handlePostJob = async (e) => {
    e.preventDefault();

    try {
      const newJob = {
        employerID: 1,
        categoryID: 1,
        title: title,
        description: description,
        location: location,
        salary: Number(salary),
        jobType: jobType
      };

      await axios.post(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/jobs/add",
        newJob
      );

      alert("Job Posted Successfully!");

      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");
      setJobType("");

      setShowForm(false);

      loadData();

    } catch (error) {
      console.error("Error posting job:", error);
      alert("Job posting failed!");
    }
  };

  const handleStatusChange = async (applicationID, status) => {
    try {
      await axios.patch(
        `https://job-portal-with-employer-dashboard-production.up.railway.app/api/applications/${applicationID}/status`,
        status,
        {
          headers: {
            "Content-Type": "text/plain"
          }
        }
      );

      alert("Status updated successfully!");

      loadData();

    } catch (error) {
      console.error("Status update error:", error);
      alert("Status update failed!");
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
        backgroundColor: "#f4f6f9"
      }}
    >

      {/* Header */}

      <div
        style={{
          backgroundColor: "#17232d",
          color: "white",
          padding: "20px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <div>

          <h1 style={{ margin: 0 }}>
            💼 JobPortal
          </h1>

          <p
            style={{
              margin: "5px 0",
              color: "#b8c1c8"
            }}
          >
            Employer Dashboard
          </p>

        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>

      </div>

      {/* Main Content */}

      <div style={{ padding: "30px" }}>

        {/* Welcome */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <h2>
            Welcome Employer 👋
          </h2>

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: "#198754",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            + Post New Job
          </button>

        </div>

        {/* Post Job Form */}

        {showForm && (

          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              marginTop: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >

            <h2>
              📝 Post New Job
            </h2>

            <form onSubmit={handlePostJob}>

              <input
                type="text"
                placeholder="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={inputStyle}
              />

              <textarea
                placeholder="Job Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  ...inputStyle,
                  height: "100px"
                }}
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                style={inputStyle}
              />

              <input
                type="number"
                placeholder="Salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
                style={inputStyle}
              />

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                required
                style={inputStyle}
              >

                <option value="">
                  Select Job Type
                </option>

                <option value="Full Time">
                  Full Time
                </option>

                <option value="Part Time">
                  Part Time
                </option>

                <option value="Internship">
                  Internship
                </option>

                <option value="Contract">
                  Contract
                </option>

              </select>

              <button
                type="submit"
                style={{
                  backgroundColor: "#0d6efd",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginRight: "10px"
                }}
              >
                Post Job
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  padding: "12px 25px",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>

            </form>

          </div>

        )}

        {/* Statistics */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
            marginTop: "25px"
          }}
        >

          <div style={cardStyle}>
            <h3>Total Jobs</h3>
            <h1>{jobs.length}</h1>
          </div>

          <div style={cardStyle}>
            <h3>Total Applications</h3>
            <h1>{applications.length}</h1>
          </div>

          <div style={cardStyle}>
            <h3>Applied</h3>
            <h1>{getStatusCount("Applied")}</h1>
          </div>

          <div style={cardStyle}>
            <h3>Under Review</h3>
            <h1>{getStatusCount("Under Review")}</h1>
          </div>

        </div>

        {/* Posted Jobs */}

        <div style={sectionStyle}>

          <h2>
            📋 Posted Jobs
          </h2>

          <table style={tableStyle}>

            <thead>

              <tr
                style={{
                  backgroundColor: "#17232d",
                  color: "white"
                }}
              >

                <th style={thStyle}>
                  ID
                </th>

                <th style={thStyle}>
                  Job Title
                </th>

                <th style={thStyle}>
                  Location
                </th>

                <th style={thStyle}>
                  Salary
                </th>

                <th style={thStyle}>
                  Job Type
                </th>

              </tr>

            </thead>

            <tbody>

              {jobs.map((job) => (

                <tr key={job.jobID}>

                  <td style={tdStyle}>
                    {job.jobID}
                  </td>

                  <td style={tdStyle}>
                    {job.title}
                  </td>

                  <td style={tdStyle}>
                    {job.location}
                  </td>

                  <td style={tdStyle}>
                    ₹{job.salary}
                  </td>

                  <td style={tdStyle}>
                    {job.jobType || "Not Specified"}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Applications */}

        <div style={sectionStyle}>

          <h2>
            📄 Recent Applications
          </h2>

          <table style={tableStyle}>

            <thead>

              <tr
                style={{
                  backgroundColor: "#17232d",
                  color: "white"
                }}
              >

                <th style={thStyle}>
                  Application ID
                </th>

                <th style={thStyle}>
                  Job
                </th>

                <th style={thStyle}>
                  Applicant Name
                </th>

                <th style={thStyle}>
                  Status
                </th>

                <th style={thStyle}>
                  Resume
                </th>

              </tr>

            </thead>

            <tbody>

              {applications.map((application) => (

                <tr key={application.applicationID}>

                  <td style={tdStyle}>
                    {application.applicationID}
                  </td>

                  <td style={tdStyle}>
                    {getJobTitle(application.jobID)}
                  </td>

                  <td style={tdStyle}>
                    {getApplicantName(application.seekerID)}
                  </td>

                  <td style={tdStyle}>

                    <select
                      value={application.status}
                      onChange={(e) =>
                        handleStatusChange(
                          application.applicationID,
                          e.target.value
                        )
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        cursor: "pointer"
                      }}
                    >

                      <option value="Applied">
                        Applied
                      </option>

                      <option value="Under Review">
                        Under Review
                      </option>

                      <option value="Selected">
                        Selected
                      </option>

                      <option value="Rejected">
                        Rejected
                      </option>

                    </select>

                  </td>

                  <td style={tdStyle}>

                    <button
                      onClick={() =>
                        viewResume(application.seekerID)
                      }
                      style={{
                        backgroundColor: "#0d6efd",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                      }}
                    >
                      View Resume
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Resume Popup */}

        {selectedResume && (

          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >

            <div
              style={{
                backgroundColor: "white",
                width: "500px",
                padding: "30px",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
              }}
            >

              <h2>
                📄 Applicant Resume
              </h2>

              <p>
                <strong>Applicant:</strong>{" "}
                {getApplicantName(selectedResume.seekerID)}
              </p>

              <p>
                <strong>Education:</strong>{" "}
                {selectedResume.education}
              </p>

              <p>
                <strong>Skills:</strong>{" "}
                {selectedResume.skills}
              </p>

              <p>
                <strong>Experience:</strong>{" "}
                {selectedResume.experience}
              </p>

             <p>
  <strong>Resume File:</strong>{" "}

  {selectedResume.filePath ? (
    <a
      href={`https://job-portal-with-employer-dashboard-production.up.railway.app${selectedResume.filePath}`}
      target="_blank"
      rel="noreferrer"
    >
      View Resume 📄
    </a>
  ) : (
    "No file uploaded"
  )}
</p>
              <button
                onClick={() => setSelectedResume(null)}
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
                Close
              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  boxSizing: "border-box",
  fontSize: "14px"
};

const cardStyle = {
  backgroundColor: "white",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const sectionStyle = {
  backgroundColor: "white",
  marginTop: "30px",
  padding: "25px",
  borderRadius: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px"
};

const thStyle = {
  padding: "12px",
  textAlign: "left"
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd"
};

export default EmployerDashboard;
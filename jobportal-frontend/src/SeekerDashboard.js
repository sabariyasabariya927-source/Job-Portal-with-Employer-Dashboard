
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SeekerDashboard.css";

function SeekerDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [page, setPage] = useState("home");

  const [editMode, setEditMode] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const [skills, setSkills] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const email = localStorage.getItem("email");

  const API =
    "http://localhost:8081";
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [jobsResponse, usersResponse, resumesResponse, applicationsResponse] =
        await Promise.all([
          axios.get(`${API}/api/jobs`),
          axios.get(`${API}/api/users`),
          axios.get(`${API}/api/resumes`),
          axios.get(`${API}/api/applications`)
        ]);

      setJobs(jobsResponse.data || []);
      setUsers(usersResponse.data || []);
      setResumes(resumesResponse.data || []);
      setApplications(applicationsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Unable to load data. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const getUserId = (user) => {
    if (!user) return null;
    return user.id ?? user.userID ?? user.userId;
  };

  const getResumeId = (resume) => {
    if (!resume) return null;
    return resume.resumeID ?? resume.resumeId ?? resume.id;
  };

  const getCurrentUser = () => {
    if (!email || !users.length) return null;

    return (
      users.find(
        (user) =>
          user.email &&
          String(user.email).trim().toLowerCase() ===
            String(email).trim().toLowerCase()
      ) || null
    );
  };

  const getCurrentResume = () => {
    const user = getCurrentUser();
    if (!user) return null;

    const userId = getUserId(user);

    return (
      resumes.find(
        (resume) =>
          String(resume.seekerID ?? resume.seekerId) ===
          String(userId)
      ) || null
    );
  };

  const getMyApplications = () => {
    const user = getCurrentUser();
    if (!user) return [];

    const userId = getUserId(user);

    return applications.filter(
      (application) =>
        String(application.seekerID ?? application.seekerId) ===
        String(userId)
    );
  };

  const getJob = (jobID) =>
    jobs.find(
      (job) => String(job.jobID ?? job.jobId) === String(jobID)
    );

  const applyJob = async (jobID) => {
    try {
      const user = getCurrentUser();

      if (!user) {
        alert("User not found!");
        return;
      }

      const userId = getUserId(user);
      const resume = getCurrentResume();

      if (!resume) {
        alert("Please create your resume before applying!");
        return;
      }

      const alreadyApplied = applications.some(
        (application) =>
          String(application.jobID ?? application.jobId) ===
            String(jobID) &&
          String(application.seekerID ?? application.seekerId) ===
            String(userId)
      );

      if (alreadyApplied) {
        alert("You have already applied for this job!");
        return;
      }

      const application = {
        jobID,
        seekerID: userId,
        resumeID: getResumeId(resume),
        status: "Applied"
      };

      await axios.post(`${API}/api/applications/add`, application);

      alert("Job Applied Successfully!");
      await fetchData();
    } catch (error) {
      console.error("Apply Job error:", error);
      alert("Job application failed!");
    }
  };

  const createResume = async () => {
    try {
      const user = getCurrentUser();

      if (!user) {
        alert("User not found!");
        return;
      }

      if (!education.trim() || !skills.trim() || !experience.trim()) {
        alert("Please fill all resume details!");
        return;
      }

      const newResume = {
        seekerID: getUserId(user),
        filePath: null,
        skills,
        education,
        experience
      };

      await axios.post(`${API}/api/resumes/add`, newResume);

      alert("Resume Created Successfully!");

      setCreateMode(false);
      setSkills("");
      setEducation("");
      setExperience("");

      await fetchData();
    } catch (error) {
      console.error("Create Resume error:", error);
      alert("Resume creation failed!");
    }
  };

  const startEditResume = () => {
    const resume = getCurrentResume();

    if (!resume) {
      alert("Resume not found!");
      return;
    }

    setSkills(resume.skills || "");
    setEducation(resume.education || "");
    setExperience(resume.experience || "");
    setEditMode(true);
  };

  const updateResume = async () => {
    try {
      const resume = getCurrentResume();

      if (!resume) {
        alert("Resume not found!");
        return;
      }

      if (!education.trim() || !skills.trim() || !experience.trim()) {
        alert("Please fill all resume details!");
        return;
      }

      const updatedResume = {
        seekerID: resume.seekerID ?? resume.seekerId,
        filePath: resume.filePath,
        skills,
        education,
        experience
      };

      await axios.patch(
        `${API}/api/resumes/${getResumeId(resume)}`,
        updatedResume
      );

      alert("Resume Updated Successfully!");

      setEditMode(false);
      await fetchData();
    } catch (error) {
      console.error("Update Resume error:", error);
      alert("Resume update failed!");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const uploadResume = async () => {
    try {
      const resume = getCurrentResume();

      if (!resume) {
        alert("Resume not found!");
        return;
      }

      if (!selectedFile) {
        alert("Please select a PDF file!");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      setUploading(true);

      await axios.post(
        `${API}/api/resumes/${getResumeId(resume)}/upload`,
        formData
      );

      alert("Resume PDF Uploaded Successfully!");

      setSelectedFile(null);
      await fetchData();
    } catch (error) {
      console.error("Upload Resume error:", error);
      alert(
        error.response?.data || "Resume PDF upload failed!"
      );
    } finally {
      setUploading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const changePage = (nextPage) => {
    setPage(nextPage);
    setEditMode(false);
    setCreateMode(false);
  };

  const buttonStyle = {
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "600"
  };

  const greenButton = {
    ...buttonStyle,
    backgroundColor: "#198754",
    color: "white"
  };

  const blueButton = {
    ...buttonStyle,
    backgroundColor: "#0d6efd",
    color: "white"
  };

  const cardStyle = {
    border: "1px solid #e2e8f0",
    padding: "22px",
    marginBottom: "18px",
    borderRadius: "10px",
    backgroundColor: "#ffffff"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "7px",
    boxSizing: "border-box",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px"
  };

  const resumeForm = (title, onSave, saveLabel) => (
    <div style={{ ...cardStyle, maxWidth: "650px" }}>
      <h3>{title}</h3>

      <div style={{ marginBottom: "18px" }}>
        <label><b>Education</b></label>
        <input
          style={inputStyle}
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="Enter your education"
        />
      </div>

      <div style={{ marginBottom: "18px" }}>
        <label><b>Skills</b></label>
        <input
          style={inputStyle}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Enter your skills"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label><b>Experience</b></label>
        <input
          style={inputStyle}
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Enter your experience"
        />
      </div>

      <button style={greenButton} onClick={onSave}>
        {saveLabel}
      </button>

      <button
        style={{ ...buttonStyle, marginLeft: "10px", background: "#e2e8f0" }}
        onClick={() => {
          setCreateMode(false);
          setEditMode(false);
        }}
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div className="seeker-dashboard">
      <header className="seeker-header">
        <div>
          <h1>Job Seeker Dashboard</h1>
          <p>Welcome, {email}</p>
        </div>

        <button
          className="seeker-logout"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <nav className="seeker-navigation">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => changePage("home")}
        >
          Home
        </button>

        <button
          className={page === "applications" ? "active" : ""}
          onClick={() => changePage("applications")}
        >
          My Applications
        </button>

        <button
          className={page === "resume" ? "active" : ""}
          onClick={() => changePage("resume")}
        >
          My Resume
        </button>
      </nav>

      <main className="seeker-content">
        {page === "home" && (
          <section>
            <h2>Available Jobs</h2>
            <p className="seeker-subtitle">
              Explore opportunities and apply for jobs that match your skills.
            </p>

            {loading ? (
              <p>Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p>No jobs available.</p>
            ) : (
              <div className="seeker-job-list">
                {jobs.map((job) => {
                  const user = getCurrentUser();
                  const userId = getUserId(user);

                  const alreadyApplied = user
                    ? applications.some(
                        (application) =>
                          String(application.jobID ?? application.jobId) ===
                            String(job.jobID ?? job.jobId) &&
                          String(application.seekerID ?? application.seekerId) ===
                            String(userId)
                      )
                    : false;

                  return (
                    <article
                      className="seeker-job-card"
                      key={job.jobID ?? job.jobId}
                    >
                      <div className="seeker-job-top">
                        <div>
                          <h3>{job.title}</h3>
                          <p className="seeker-job-location">
                            {job.location || "Location not specified"}
                          </p>
                        </div>

                        <span className="seeker-job-type">
                          {job.jobType || "Full-time"}
                        </span>
                      </div>

                      <p>
                        <b>Description:</b>{" "}
                        {job.description || "No description provided"}
                      </p>

                      <p>
                        <b>Salary:</b>{" "}
                        {job.salary != null ? `₹${job.salary}` : "Not specified"}
                      </p>

                      <button
                        style={alreadyApplied
                          ? { ...buttonStyle, background: "#64748b", color: "white" }
                          : greenButton}
                        disabled={alreadyApplied}
                        onClick={() => applyJob(job.jobID ?? job.jobId)}
                      >
                        {alreadyApplied ? "Already Applied" : "Apply Job"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {page === "applications" && (
          <section>
            <h2>My Applications</h2>
            <p className="seeker-subtitle">
              Track the status of the jobs you have applied for.
            </p>

            {loading ? (
              <p>Loading applications...</p>
            ) : getMyApplications().length === 0 ? (
              <div className="seeker-empty">
                <h3>No applications yet</h3>
                <p>You have not applied for any jobs yet.</p>
                <button
                  style={blueButton}
                  onClick={() => changePage("home")}
                >
                  Browse Available Jobs
                </button>
              </div>
            ) : (
              <div className="seeker-job-list">
                {getMyApplications().map((application, index) => {
                  const job = getJob(
                    application.jobID ?? application.jobId
                  );

                  const status = application.status || "Applied";

                  return (
                    <article
                      className="seeker-job-card"
                      key={application.applicationID ?? application.applicationId ?? index}
                    >
                      <h3>{job ? job.title : "Job Not Found"}</h3>

                      <p>
                        <b>Application ID:</b>{" "}
                        {application.applicationID ?? application.applicationId ?? "N/A"}
                      </p>

                      {job && (
                        <>
                          <p><b>Location:</b> {job.location || "Not specified"}</p>
                          <p><b>Salary:</b> {job.salary != null ? `₹${job.salary}` : "Not specified"}</p>
                          <p><b>Job Type:</b> {job.jobType || "Not specified"}</p>
                        </>
                      )}

                      <p>
                        <b>Status:</b>{" "}
                        <span className={`seeker-status seeker-status-${String(status).toLowerCase().replace(/\s+/g, "-")}`}>
                          {status}
                        </span>
                      </p>

                      <p>
                        <b>Resume ID:</b>{" "}
                        {application.resumeID ?? application.resumeId ?? "N/A"}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {page === "resume" && (
          <section>
            <h2>My Resume</h2>
            <p className="seeker-subtitle">
              Keep your profile updated to help employers review your application.
            </p>

            {loading ? (
              <p>Loading resume...</p>
            ) : (() => {
              const user = getCurrentUser();
              const resume = getCurrentResume();

              if (!user) {
                return (
                  <div className="seeker-empty">
                    <h3>User not found</h3>
                    <p>Logged in email: {email}</p>
                  </div>
                );
              }

              if (!resume) {
                return createMode
                  ? resumeForm("Create Resume", createResume, "Save Resume")
                  : (
                    <div className="seeker-empty">
                      <h3>Resume not found</h3>
                      <p>Create your resume before applying for jobs.</p>
                      <button
                        style={greenButton}
                        onClick={() => setCreateMode(true)}
                      >
                        Create Resume
                      </button>
                    </div>
                  );
              }

              if (editMode) {
                return resumeForm("Edit Resume", updateResume, "Update Resume");
              }

              return (
                <div style={cardStyle}>
                  <div className="seeker-resume-heading">
                    <div className="seeker-avatar">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <h3>{user.name || "Job Seeker"}</h3>
                      <p>{user.email}</p>
                    </div>
                  </div>

                  <hr />

                  <p><b>Resume ID:</b> {getResumeId(resume)}</p>
                  <p><b>Education:</b> {resume.education || "Not provided"}</p>
                  <p><b>Skills:</b> {resume.skills || "Not provided"}</p>
                  <p><b>Experience:</b> {resume.experience || "Not provided"}</p>

                  <p>
                    <b>Resume File:</b>{" "}
                    {resume.filePath ? (
                      <a
                        href={`${API}${resume.filePath}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Resume PDF
                      </a>
                    ) : (
                      "No file uploaded"
                    )}
                  </p>

                  <button style={blueButton} onClick={startEditResume}>
                    Edit Resume
                  </button>

                  <div className="seeker-upload-box">
                    <h3>Upload Resume PDF</h3>
                    <p>Select your resume as a PDF file.</p>

                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                    />

                    {selectedFile && (
                      <p>
                        <b>Selected File:</b> {selectedFile.name}
                      </p>
                    )}

                    <button
                      style={{
                        ...buttonStyle,
                        background: "#6f42c1",
                        color: "white",
                        marginTop: "12px"
                      }}
                      onClick={uploadResume}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Resume"}
                    </button>
                  </div>
                </div>
              );
            })()}
          </section>
        )}
      </main>
    </div>
  );
}

export default SeekerDashboard;

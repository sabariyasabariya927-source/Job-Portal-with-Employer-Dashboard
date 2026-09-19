import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const jobsResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/jobs"
      );

      const usersResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/users"
      );

      const resumesResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/resumes"
      );

      const applicationsResponse = await axios.get(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/applications"
      );

      setJobs(jobsResponse.data);
      setUsers(usersResponse.data);
      setResumes(resumesResponse.data);
      setApplications(applicationsResponse.data);

      setLoading(false);

    } catch (error) {

      console.error("Error fetching data:", error);

      setLoading(false);

      alert("Unable to load data");
    }
  };

  const getCurrentUser = () => {

    return users.find(
      (user) =>
        String(user.email).trim().toLowerCase() ===
        String(email).trim().toLowerCase()
    );
  };

  const getCurrentResume = () => {

    const user = getCurrentUser();

    if (!user) {
      return null;
    }

    return resumes.find(
      (resume) =>
        String(resume.seekerID) ===
        String(user.id)
    );
  };

  const applyJob = async (jobID) => {

    try {

      const user = getCurrentUser();

      if (!user) {
        alert("User not found!");
        return;
      }

      const resume = getCurrentResume();

      if (!resume) {
        alert("Please create your resume before applying!");
        return;
      }

      const alreadyApplied = applications.some(
        (application) =>
          String(application.jobID) === String(jobID) &&
          String(application.seekerID) === String(user.id)
      );

      if (alreadyApplied) {
        alert("You have already applied for this job!");
        return;
      }

      const application = {
        jobID: jobID,
        seekerID: user.id,
        resumeID: resume.resumeID,
        status: "Applied"
      };

      await axios.post(
        "https://job-portal-with-employer-dashboard-production.up.railway.app/api/applications/add",
        application
      );

      alert("Job Applied Successfully! ✅");

      fetchData();

    } catch (error) {

      console.error("Apply Job error:", error);

      alert("Job application failed!");
    }
  };

  const getMyApplications = () => {

    const user = getCurrentUser();

    if (!user) {
      return [];
    }

    return applications.filter(
      (application) =>
        String(application.seekerID) ===
        String(user.id)
    );
  };

  const getJob = (jobID) => {

    return jobs.find(
      (job) =>
        String(job.jobID) === String(jobID)
    );
  };
const createResume = async () => {
  try {
    const user = getCurrentUser();

    if (!user) {
      alert("User not found!");
      return;
    }

    if (!education || !skills || !experience) {
      alert("Please fill all resume details!");
      return;
    }

    const newResume = {
      seekerID: user.id,
      filePath: null,
      skills: skills,
      education: education,
      experience: experience
    };

    await axios.post(
      "https://job-portal-with-employer-dashboard-production.up.railway.app/api/resumes/add",
      newResume
    );

    alert("Resume Created Successfully! ✅");

    setCreateMode(false);
    setSkills("");
    setEducation("");
    setExperience("");

    fetchData();

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

      const updatedResume = {
        seekerID: resume.seekerID,
        filePath: resume.filePath,
        skills: skills,
        education: education,
        experience: experience
      };

      await axios.patch(
        `https://job-portal-with-employer-dashboard-production.up.railway.app/api/resumes/${resume.resumeID}`,
        updatedResume
      );

      alert("Resume Updated Successfully! ✅");

      setEditMode(false);

      fetchData();

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
        `https://job-portal-with-employer-dashboard-production.up.railway.app/api/resumes/${resume.resumeID}/upload`,
        formData
      );

      alert("Resume PDF Uploaded Successfully! ✅");

      setSelectedFile(null);

      setUploading(false);

      fetchData();

    } catch (error) {

      console.error("Upload Resume error:", error);

      setUploading(false);

      if (error.response && error.response.data) {
        alert(error.response.data);
      } else {
        alert("Resume PDF upload failed!");
      }
    }
  };

  const logout = () => {

    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    navigate("/");
  };

  return (
    <div
      style={{
        padding: "30px"
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >

        <div>

          <h1>
            Job Seeker Dashboard
          </h1>

          <p>
            Welcome, {email}
          </p>

        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

      </div>

      <hr />

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px"
        }}
      >

        <button
          onClick={() => {
            setPage("home");
            setEditMode(false);
          }}
          style={{
            marginRight: "10px",
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          Home
        </button>

        <button
          onClick={() => {
            setPage("applications");
            setEditMode(false);
          }}
          style={{
            marginRight: "10px",
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          My Applications
        </button>

        <button
          onClick={() => {
            setPage("resume");
            setEditMode(false);
          }}
          style={{
            padding: "10px 18px",
            cursor: "pointer"
          }}
        >
          My Resume
        </button>

      </div>

      <hr />

      {page === "home" && (

        <div>

          <h2>
            Available Jobs
          </h2>

          {loading ? (

            <p>
              Loading jobs...
            </p>

          ) : jobs.length === 0 ? (

            <p>
              No jobs available.
            </p>

          ) : (

            <div>

              {jobs.map((job) => {

                const user = getCurrentUser();

                const alreadyApplied = user
                  ? applications.some(
                      (application) =>
                        String(application.jobID) ===
                        String(job.jobID) &&
                        String(application.seekerID) ===
                        String(user.id)
                    )
                  : false;

                return (

                  <div
                    key={job.jobID}
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      marginBottom: "15px",
                      borderRadius: "8px"
                    }}
                  >

                    <h3>
                      {job.title}
                    </h3>

                    <p>
                      <b>Description:</b>{" "}
                      {job.description}
                    </p>

                    <p>
                      <b>Location:</b>{" "}
                      {job.location}
                    </p>

                    <p>
                      <b>Salary:</b>{" "}
                      ₹{job.salary}
                    </p>

                    <p>
                      <b>Job Type:</b>{" "}
                      {job.jobType || "Not Specified"}
                    </p>

                    {alreadyApplied ? (

                      <button
                        disabled
                        style={{
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          padding: "10px 18px",
                          borderRadius: "6px"
                        }}
                      >
                        Already Applied
                      </button>

                    ) : (

                      <button
                        onClick={() =>
                          applyJob(job.jobID)
                        }
                        style={{
                          backgroundColor: "#198754",
                          color: "white",
                          border: "none",
                          padding: "10px 18px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold"
                        }}
                      >
                        Apply Job
                      </button>

                    )}

                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

      {page === "applications" && (

        <div>

          <h2>
            My Applications
          </h2>

          {loading ? (

            <p>
              Loading applications...
            </p>

          ) : getMyApplications().length === 0 ? (

            <p>
              You have not applied for any jobs yet.
            </p>

          ) : (

            <div>

              {getMyApplications().map((application) => {

                const job = getJob(application.jobID);

                return (

                  <div
                    key={application.applicationID}
                    style={{
                      border: "1px solid #ccc",
                      padding: "20px",
                      marginBottom: "15px",
                      borderRadius: "8px"
                    }}
                  >

                    <h3>
                      {job
                        ? job.title
                        : "Job Not Found"}
                    </h3>

                    <p>
                      <b>Application ID:</b>{" "}
                      {application.applicationID}
                    </p>

                    {job && (
                      <>
                        <p>
                          <b>Location:</b>{" "}
                          {job.location}
                        </p>

                        <p>
                          <b>Salary:</b>{" "}
                          ₹{job.salary}
                        </p>

                        <p>
                          <b>Job Type:</b>{" "}
                          {job.jobType || "Not Specified"}
                        </p>
                      </>
                    )}

                    <p>
  <b>Status:</b>{" "}

  <span
    style={{
      padding: "6px 12px",
      borderRadius: "15px",
      fontWeight: "bold",
      backgroundColor:
        application.status === "Selected"
          ? "#d4edda"
          : application.status === "Rejected"
          ? "#f8d7da"
          : application.status === "Under Review"
          ? "#fff3cd"
          : "#e2e3e5"
    }}
  >
    {application.status}
  </span>
</p>
                    <p>
                      <b>Resume ID:</b>{" "}
                      {application.resumeID}
                    </p>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      )}

      {page === "resume" && (

        <div>

          <h2>
            My Resume
          </h2>

          {(() => {

            const user = getCurrentUser();
            const resume = getCurrentResume();

            if (!user) {
              return (
                <p>
                  User not found.
                </p>
              );
            }

           if (!resume) {
  if (!createMode) {
    return (
      <div>
        <p>Resume not found.</p>

        <button
          onClick={() => setCreateMode(true)}
          style={{
            backgroundColor: "#198754",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Create Resume
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "8px",
        maxWidth: "600px"
      }}
    >
      <h3>Create Resume</h3>

      <div style={{ marginBottom: "15px" }}>
        <label><b>Education</b></label>
        <input
          type="text"
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          placeholder="Enter education"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label><b>Skills</b></label>
        <input
          type="text"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Enter skills"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            boxSizing: "border-box"
          }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label><b>Experience</b></label>
        <input
          type="text"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Enter experience"
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            boxSizing: "border-box"
          }}
        />
      </div>

      <button
        onClick={createResume}
        style={{
          backgroundColor: "#198754",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          marginRight: "10px"
        }}
      >
        Save Resume
      </button>

      <button
        onClick={() => setCreateMode(false)}
        style={{
          padding: "10px 18px",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Cancel
      </button>
    </div>
  );
}

            if (editMode) {

              return (

                <div
                  style={{
                    border: "1px solid #ccc",
                    padding: "25px",
                    marginTop: "20px",
                    borderRadius: "8px",
                    maxWidth: "600px"
                  }}
                >

                  <h3>
                    Edit Resume
                  </h3>

                  <div
                    style={{
                      marginBottom: "15px"
                    }}
                  >

                    <label>
                      <b>Education</b>
                    </label>

                    <input
                      type="text"
                      value={education}
                      onChange={(e) =>
                        setEducation(e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "5px",
                        boxSizing: "border-box"
                      }}
                    />

                  </div>

                  <div
                    style={{
                      marginBottom: "15px"
                    }}
                  >

                    <label>
                      <b>Skills</b>
                    </label>

                    <input
                      type="text"
                      value={skills}
                      onChange={(e) =>
                        setSkills(e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "5px",
                        boxSizing: "border-box"
                      }}
                    />

                  </div>

                  <div
                    style={{
                      marginBottom: "20px"
                    }}
                  >

                    <label>
                      <b>Experience</b>
                    </label>

                    <input
                      type="text"
                      value={experience}
                      onChange={(e) =>
                        setExperience(e.target.value)
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "5px",
                        boxSizing: "border-box"
                      }}
                    />

                  </div>

                  <button
                    onClick={updateResume}
                    style={{
                      backgroundColor: "#198754",
                      color: "white",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginRight: "10px"
                    }}
                  >
                    Update Resume
                  </button>

                  <button
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>

                </div>

              );

            }

            return (

              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "25px",
                  marginTop: "20px",
                  borderRadius: "8px"
                }}
              >

                <h3>
                  {user.name}
                </h3>

                <p>
                  <b>Email:</b>{" "}
                  {user.email}
                </p>

                <hr />

                <p>
                  <b>Resume ID:</b>{" "}
                  {resume.resumeID}
                </p>

                <p>
                  <b>Education:</b>{" "}
                  {resume.education}
                </p>

                <p>
                  <b>Skills:</b>{" "}
                  {resume.skills}
                </p>

                <p>
                  <b>Experience:</b>{" "}
                  {resume.experience}
                </p>

                <p>
                  <b>Resume File:</b>{" "}
                 {resume.filePath ? (
  <a
    href={`https://job-portal-with-employer-dashboard-production.up.railway.app${resume.filePath}`}
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
                  onClick={startEditResume}
                  style={{
                    backgroundColor: "#0d6efd",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    marginRight: "10px"
                  }}
                >
                  Edit Resume
                </button>

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "20px",
                    borderTop: "1px solid #ddd"
                  }}
                >

                  <h3>
                    Upload Resume PDF
                  </h3>

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                  />

                  {selectedFile && (
                    <p>
                      <b>Selected File:</b>{" "}
                      {selectedFile.name}
                    </p>
                  )}

                  <button
                    onClick={uploadResume}
                    disabled={uploading}
                    style={{
                      backgroundColor: "#6f42c1",
                      color: "white",
                      border: "none",
                      padding: "10px 18px",
                      borderRadius: "6px",
                      cursor: uploading
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: "bold",
                      marginTop: "10px"
                    }}
                  >
                    {uploading
                      ? "Uploading..."
                      : "Upload Resume"}
                  </button>

                </div>

              </div>

            );

          })()}

        </div>

      )}

    </div>
  );
}

export default SeekerDashboard;
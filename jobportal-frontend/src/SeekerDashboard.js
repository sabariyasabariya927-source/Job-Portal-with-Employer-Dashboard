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

  const API = "http://localhost:8081";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const jobsResponse = await axios.get(
        `${API}/api/jobs`
      );

      const usersResponse = await axios.get(
        `${API}/api/users`
      );

      const resumesResponse = await axios.get(
        `${API}/api/resumes`
      );

      const applicationsResponse = await axios.get(
        `${API}/api/applications`
      );

      console.log("JOBS:", jobsResponse.data);
      console.log("USERS:", usersResponse.data);
      console.log("RESUMES:", resumesResponse.data);
      console.log("APPLICATIONS:", applicationsResponse.data);

      setJobs(jobsResponse.data || []);
      setUsers(usersResponse.data || []);
      setResumes(resumesResponse.data || []);
      setApplications(applicationsResponse.data || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);

      setLoading(false);

      alert("Unable to load data");
    }
  };

  const getUserId = (user) => {
    if (!user) {
      return null;
    }

    return user.id ?? user.userID ?? user.userId;
  };

  const getResumeId = (resume) => {
    if (!resume) {
      return null;
    }

    return resume.resumeID ?? resume.resumeId ?? resume.id;
  };

  const getCurrentUser = () => {
    if (!email || !users.length) {
      return null;
    }

    const currentUser = users.find(
      (user) =>
        user.email &&
        String(user.email).trim().toLowerCase() ===
          String(email).trim().toLowerCase()
    );

    console.log("CURRENT USER:", currentUser);

    return currentUser || null;
  };

  const getCurrentResume = () => {
    const user = getCurrentUser();

    if (!user) {
      return null;
    }

    const userId = getUserId(user);

    console.log("CURRENT USER ID:", userId);

    const currentResume = resumes.find(
      (resume) =>
        String(resume.seekerID) === String(userId) ||
        String(resume.seekerId) === String(userId)
    );

    console.log("CURRENT RESUME:", currentResume);

    return currentResume || null;
  };

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

      const resumeId = getResumeId(resume);

      const alreadyApplied = applications.some(
        (application) =>
          String(application.jobID) === String(jobID) &&
          String(application.seekerID) === String(userId)
      );

      if (alreadyApplied) {
        alert("You have already applied for this job!");
        return;
      }

      const application = {
        jobID: jobID,
        seekerID: userId,
        resumeID: resumeId,
        status: "Applied"
      };

      console.log("APPLICATION DATA:", application);

      await axios.post(
        `${API}/api/applications/add`,
        application
      );

      alert("Job Applied Successfully! ✅");

      fetchData();
    } catch (error) {
      console.error("Apply Job error:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

      alert("Job application failed!");
    }
  };

  const getMyApplications = () => {
    const user = getCurrentUser();

    if (!user) {
      return [];
    }

    const userId = getUserId(user);

    return applications.filter(
      (application) =>
        String(application.seekerID) ===
        String(userId)
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

      const userId = getUserId(user);

      if (!education || !skills || !experience) {
        alert("Please fill all resume details!");
        return;
      }

      const newResume = {
        seekerID: userId,
        filePath: null,
        skills: skills,
        education: education,
        experience: experience
      };

      console.log("NEW RESUME:", newResume);

      await axios.post(
        `${API}/api/resumes/add`,
        newResume
      );

      alert("Resume Created Successfully! ✅");

      setCreateMode(false);
      setSkills("");
      setEducation("");
      setExperience("");

      await fetchData();
    } catch (error) {
      console.error("Create Resume error:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

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

      const resumeId = getResumeId(resume);

      const updatedResume = {
        seekerID: resume.seekerID,
        filePath: resume.filePath,
        skills: skills,
        education: education,
        experience: experience
      };

      console.log("UPDATED RESUME:", updatedResume);

      await axios.patch(
        `${API}/api/resumes/${resumeId}`,
        updatedResume
      );

      alert("Resume Updated Successfully! ✅");

      setEditMode(false);

      await fetchData();
    } catch (error) {
      console.error("Update Resume error:", error);

      if (error.response) {
        console.error(
          "Backend response:",
          error.response.data
        );
      }

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

      const resumeId = getResumeId(resume);

      const formData = new FormData();

      formData.append("file", selectedFile);

      setUploading(true);

      await axios.post(
        `${API}/api/resumes/${resumeId}/upload`,
        formData
      );

      alert("Resume PDF Uploaded Successfully! ✅");

      setSelectedFile(null);

      setUploading(false);

      await fetchData();
    } catch (error) {
      console.error("Upload Resume error:", error);

      setUploading(false);

      if (
        error.response &&
        error.response.data
      ) {
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
            setCreateMode(false);
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
            setCreateMode(false);
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
            setCreateMode(false);
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

                const userId = getUserId(user);

                const alreadyApplied = user
                  ? applications.some(
                      (application) =>
                        String(application.jobID) ===
                          String(job.jobID) &&
                        String(application.seekerID) ===
                          String(userId)
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
                      {job.jobType ||
                        "Not Specified"}
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
              {getMyApplications().map(
                (application) => {
                  const job = getJob(
                    application.jobID
                  );

                  return (
                    <div
                      key={
                        application.applicationID
                      }
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
                        <b>
                          Application ID:
                        </b>{" "}
                        {application.applicationID}
                      </p>

                      {job && (
                        <>
                          <p>
                            <b>
                              Location:
                            </b>{" "}
                            {job.location}
                          </p>

                          <p>
                            <b>
                              Salary:
                            </b>{" "}
                            ₹{job.salary}
                          </p>

                          <p>
                            <b>
                              Job Type:
                            </b>{" "}
                            {job.jobType ||
                              "Not Specified"}
                          </p>
                        </>
                      )}

                      <p>
                        <b>Status:</b>{" "}

                        <span
                          style={{
                            padding:
                              "6px 12px",
                            borderRadius:
                              "15px",
                            fontWeight:
                              "bold",
                            backgroundColor:
                              application.status ===
                              "Selected"
                                ? "#d4edda"
                                : application.status ===
                                  "Rejected"
                                ? "#f8d7da"
                                : application.status ===
                                  "Under Review"
                                ? "#fff3cd"
                                : "#e2e3e5"
                          }}
                        >
                          {application.status}
                        </span>
                      </p>

                      <p>
                        <b>
                          Resume ID:
                        </b>{" "}
                        {application.resumeID}
                      </p>
                    </div>
                  );
                }
              )}
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
                <div>
                  <p>
                    User not found.
                  </p>

                  <p
                    style={{
                      color: "#777"
                    }}
                  >
                    Logged in email: {email}
                  </p>
                </div>
              );
            }

            if (!resume) {
              if (!createMode) {
                return (
                  <div>
                    <p>
                      Resume not found.
                    </p>

                    <button
                      onClick={() =>
                        setCreateMode(true)
                      }
                      style={{
                        backgroundColor:
                          "#198754",
                        color: "white",
                        border: "none",
                        padding:
                          "10px 18px",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "bold"
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
                    border:
                      "1px solid #ccc",
                    padding: "25px",
                    marginTop: "20px",
                    borderRadius:
                      "8px",
                    maxWidth:
                      "600px"
                  }}
                >
                  <h3>
                    Create Resume
                  </h3>

                  <div
                    style={{
                      marginBottom:
                        "15px"
                    }}
                  >
                    <label>
                      <b>
                        Education
                      </b>
                    </label>

                    <input
                      type="text"
                      value={
                        education
                      }
                      onChange={(e) =>
                        setEducation(
                          e.target.value
                        )
                      }
                      placeholder="Enter education"
                      style={{
                        width: "100%",
                        padding:
                          "10px",
                        marginTop:
                          "5px",
                        boxSizing:
                          "border-box"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom:
                        "15px"
                    }}
                  >
                    <label>
                      <b>
                        Skills
                      </b>
                    </label>

                    <input
                      type="text"
                      value={skills}
                      onChange={(e) =>
                        setSkills(
                          e.target.value
                        )
                      }
                      placeholder="Enter skills"
                      style={{
                        width: "100%",
                        padding:
                          "10px",
                        marginTop:
                          "5px",
                        boxSizing:
                          "border-box"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom:
                        "20px"
                    }}
                  >
                    <label>
                      <b>
                        Experience
                      </b>
                    </label>

                    <input
                      type="text"
                      value={
                        experience
                      }
                      onChange={(e) =>
                        setExperience(
                          e.target.value
                        )
                      }
                      placeholder="Enter experience"
                      style={{
                        width: "100%",
                        padding:
                          "10px",
                        marginTop:
                          "5px",
                        boxSizing:
                          "border-box"
                      }}
                    />
                  </div>

                  <button
                    onClick={
                      createResume
                    }
                    style={{
                      backgroundColor:
                        "#198754",
                      color: "white",
                      border: "none",
                      padding:
                        "10px 18px",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer",
                      fontWeight:
                        "bold",
                      marginRight:
                        "10px"
                    }}
                  >
                    Save Resume
                  </button>

                  <button
                    onClick={() =>
                      setCreateMode(
                        false
                      )
                    }
                    style={{
                      padding:
                        "10px 18px",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer"
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
                    border:
                      "1px solid #ccc",
                    padding: "25px",
                    marginTop: "20px",
                    borderRadius:
                      "8px",
                    maxWidth:
                      "600px"
                  }}
                >
                  <h3>
                    Edit Resume
                  </h3>

                  <div
                    style={{
                      marginBottom:
                        "15px"
                    }}
                  >
                    <label>
                      <b>
                        Education
                      </b>
                    </label>

                    <input
                      type="text"
                      value={
                        education
                      }
                      onChange={(e) =>
                        setEducation(
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        padding:
                          "10px",
                        marginTop:
                          "5px",
                        boxSizing:
                          "border-box"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom:
                        "15px"
                    }}
                  >
                    <label>
                      <b>
                        Skills
                      </b>
                    </label>

                    <input
                      type="text"
                      value={skills}
                      onChange={(e) =>
                        setSkills(
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        padding:
                          "10px",
                        marginTop:
                          "5px",
                        boxSizing:
                          "border-box"
                      }}
                    />
                  </div>

                  <div
                    style={{
                      marginBottom:
                        "20px"
                    }}
                  >
                    <label>
                      <b>
                        Experience
                      </b>
                    </label>

                    <input
                      type="text"
                      value={
                        experience
                      }
                      onChange={(e) =>
                        setExperience(
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        padding:
                          "10px",
                        marginTop:
                          "5px",
                        boxSizing:
                          "border-box"
                      }}
                    />
                  </div>

                  <button
                    onClick={
                      updateResume
                    }
                    style={{
                      backgroundColor:
                        "#198754",
                      color: "white",
                      border: "none",
                      padding:
                        "10px 18px",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer",
                      marginRight:
                        "10px"
                    }}
                  >
                    Update Resume
                  </button>

                  <button
                    onClick={() =>
                      setEditMode(
                        false
                      )
                    }
                    style={{
                      padding:
                        "10px 18px",
                      borderRadius:
                        "6px",
                      cursor:
                        "pointer"
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
                  border:
                    "1px solid #ccc",
                  padding: "25px",
                  marginTop: "20px",
                  borderRadius:
                    "8px"
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
                  <b>
                    Resume ID:
                  </b>{" "}
                  {getResumeId(resume)}
                </p>

                <p>
                  <b>
                    Education:
                  </b>{" "}
                  {resume.education}
                </p>

                <p>
                  <b>
                    Skills:
                  </b>{" "}
                  {resume.skills}
                </p>

                <p>
                  <b>
                    Experience:
                  </b>{" "}
                  {resume.experience}
                </p>

                <p>
                  <b>
                    Resume File:
                  </b>{" "}

                  {resume.filePath ? (
                    <a
                      href={`${API}${resume.filePath}`}
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
                  onClick={
                    startEditResume
                  }
                  style={{
                    backgroundColor:
                      "#0d6efd",
                    color: "white",
                    border: "none",
                    padding:
                      "10px 18px",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "bold",
                    marginRight:
                      "10px"
                  }}
                >
                  Edit Resume
                </button>

                <div
                  style={{
                    marginTop:
                      "20px",
                    paddingTop:
                      "20px",
                    borderTop:
                      "1px solid #ddd"
                  }}
                >
                  <h3>
                    Upload Resume PDF
                  </h3>

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={
                      handleFileChange
                    }
                  />

                  {selectedFile && (
                    <p>
                      <b>
                        Selected File:
                      </b>{" "}
                      {
                        selectedFile.name
                      }
                    </p>
                  )}

                  <button
                    onClick={
                      uploadResume
                    }
                    disabled={
                      uploading
                    }
                    style={{
                      backgroundColor:
                        "#6f42c1",
                      color: "white",
                      border: "none",
                      padding:
                        "10px 18px",
                      borderRadius:
                        "6px",
                      cursor:
                        uploading
                          ? "not-allowed"
                          : "pointer",
                      fontWeight:
                        "bold",
                      marginTop:
                        "10px"
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
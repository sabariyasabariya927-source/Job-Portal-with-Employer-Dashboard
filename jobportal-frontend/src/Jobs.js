import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Jobs() {

    const [jobs, setJobs] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        axios.get("http://localhost:8080/api/jobs")
            .then((response) => {
                setJobs(response.data);
            })
            .catch((error) => {
                console.log("Error loading jobs:", error);
            });

    }, []);

    return (
        <div className="jobs-container">

            <h1>Available Jobs</h1>

            {jobs.length === 0 ? (

                <p>No jobs available.</p>

            ) : (

                <div className="jobs-list">

                    {jobs.map((job) => (

                        <div className="job-card" key={job.id}>

                            <h2>{job.title}</h2>

                            <p>
                                <strong>Company:</strong>{" "}
                                {job.companyName}
                            </p>

                            <p>
                                <strong>Location:</strong>{" "}
                                {job.location}
                            </p>

                            <p>
                                {job.description}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(`/jobs/${job.id}`)
                                }
                            >
                                View Details
                            </button>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Jobs;
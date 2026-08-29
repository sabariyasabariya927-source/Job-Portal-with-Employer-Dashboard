package com.jobportal.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long applicationID;

    private Long jobID;
    private Long seekerID;
    private Long resumeID;

    @Column(length = 50)
    private String status = "Applied";

    private LocalDateTime appliedDate = LocalDateTime.now();

    // Constructors
    public Application() {}

    public Application(Long jobID, Long seekerID, Long resumeID, String status) {
        this.jobID = jobID;
        this.seekerID = seekerID;
        this.resumeID = resumeID;
        this.status = status;
    }

    // Getters & Setters
    public Long getApplicationID() { return applicationID; }
    public void setApplicationID(Long applicationID) { this.applicationID = applicationID; }

    public Long getJobID() { return jobID; }
    public void setJobID(Long jobID) { this.jobID = jobID; }

    public Long getSeekerID() { return seekerID; }
    public void setSeekerID(Long seekerID) { this.seekerID = seekerID; }

    public Long getResumeID() { return resumeID; }
    public void setResumeID(Long resumeID) { this.resumeID = resumeID; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getAppliedDate() { return appliedDate; }
    public void setAppliedDate(LocalDateTime appliedDate) { this.appliedDate = appliedDate; }
}

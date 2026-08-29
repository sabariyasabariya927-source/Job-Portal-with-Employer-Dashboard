package com.jobportal.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Resumes")
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long resumeID;

    @Column(nullable = false)
    private Long seekerID;

    private String filePath;
    private String skills;
    private String education;
    private String experience;

    // Constructors
    public Resume() {}

    public Resume(Long seekerID, String filePath, String skills, String education, String experience) {
        this.seekerID = seekerID;
        this.filePath = filePath;
        this.skills = skills;
        this.education = education;
        this.experience = experience;
    }

    // Getters & Setters
    public Long getResumeID() { return resumeID; }
    public void setResumeID(Long resumeID) { this.resumeID = resumeID; }

    public Long getSeekerID() { return seekerID; }
    public void setSeekerID(Long seekerID) { this.seekerID = seekerID; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
}


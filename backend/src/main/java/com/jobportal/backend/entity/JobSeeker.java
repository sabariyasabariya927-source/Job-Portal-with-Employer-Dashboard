package com.jobportal.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "JobSeekers")
public class JobSeeker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seekerID;

    private Long userID;
    private String fullName;
    private String email;

    // Constructors
    public JobSeeker() {}

    public JobSeeker(Long userID, String fullName, String email) {
        this.userID = userID;
        this.fullName = fullName;
        this.email = email;
    }

    // Getters and Setters
    public Long getSeekerID() {
        return seekerID;
    }

    public void setSeekerID(Long seekerID) {
        this.seekerID = seekerID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

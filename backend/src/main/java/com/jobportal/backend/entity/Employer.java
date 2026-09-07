package com.jobportal.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Employers")
public class Employer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "EmployerID")
    private Long employerID;

    @Column(name = "UserID", nullable = false)
    private Long userID;

    @Column(name = "CompanyName", nullable = false, length = 150)
    private String companyName;

    @Column(name = "CompanyDescription", length = 500)
    private String companyDescription;

    @Column(name = "Location", nullable = false, length = 100)
    private String location;

    // Default Constructor
    public Employer() {
    }

    // Parameterized Constructor
    public Employer(Long userID, String companyName,
                    String companyDescription, String location) {

        this.userID = userID;
        this.companyName = companyName;
        this.companyDescription = companyDescription;
        this.location = location;
    }

    // Getters and Setters

    public Long getEmployerID() {
        return employerID;
    }

    public void setEmployerID(Long employerID) {
        this.employerID = employerID;
    }

    public Long getUserID() {
        return userID;
    }

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyDescription() {
        return companyDescription;
    }

    public void setCompanyDescription(String companyDescription) {
        this.companyDescription = companyDescription;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
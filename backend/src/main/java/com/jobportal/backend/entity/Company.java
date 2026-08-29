package com.jobportal.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyID;

    @Column(nullable = false)
    private Long employerID;

    private Long categoryID;

    @Column(nullable = false)
    private String companyName;

    @Column(length = 500)
    private String description;

    private String location;
    private String website;

    // Constructors
    public Company() {}

    public Company(Long employerID, Long categoryID, String companyName, String description, String location, String website) {
        this.employerID = employerID;
        this.categoryID = categoryID;
        this.companyName = companyName;
        this.description = description;
        this.location = location;
        this.website = website;
    }

    // Getters and Setters
    public Long getCompanyID() { return companyID; }
    public void setCompanyID(Long companyID) { this.companyID = companyID; }

    public Long getEmployerID() { return employerID; }
    public void setEmployerID(Long employerID) { this.employerID = employerID; }

    public Long getCategoryID() { return categoryID; }
    public void setCategoryID(Long categoryID) { this.categoryID = categoryID; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}


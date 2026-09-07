package com.jobportal.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JobID")
    private Integer jobID;

    @Column(name = "EmployerID", nullable = false)
    private Integer employerID;

    @Column(name = "CategoryID")
    private Long categoryID;

    @Column(name = "Title", nullable = false, length = 150)
    private String title;

    @Column(name = "Description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Location", length = 100)
    private String location;

    @Column(name = "salary")
    private Double salary;

    @Column(name = "JobType", length = 50)
    private String jobType;

    @Column(name = "PostedDate")
    private LocalDateTime postedDate = LocalDateTime.now();

    // Default Constructor
    public Job() {
    }

    // Constructor
    public Job(Integer employerID, Long categoryID, String title,
               String description, String location,
               Double salary, String jobType) {

        this.employerID = employerID;
        this.categoryID = categoryID;
        this.title = title;
        this.description = description;
        this.location = location;
        this.salary = salary;
        this.jobType = jobType;
        this.postedDate = LocalDateTime.now();
    }

    // Getters and Setters

    public Integer getJobID() {
        return jobID;
    }

    public void setJobID(Integer jobID) {
        this.jobID = jobID;
    }

    public Integer getEmployerID() {
        return employerID;
    }

    public void setEmployerID(Integer employerID) {
        this.employerID = employerID;
    }

    public Long getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Long categoryID) {
        this.categoryID = categoryID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }
}
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
    private Long jobID;

    @Column(nullable = false)
    private Long employerID;

    private Long categoryID;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private Double salary;

    @Column(length = 50)
    private String jobType;

    private LocalDateTime postedDate = LocalDateTime.now();

    // Constructors
    public Job() {}

    public Job(Long employerID, Long categoryID, String title, String description,
               String location, Double salary, String jobType) {
        this.employerID = employerID;
        this.categoryID = categoryID;
        this.title = title;
        this.description = description;
        this.location = location;
        this.salary = salary;
        this.jobType = jobType;
    }

    // Getters & Setters
    // (same as before)
}

package com.jobportal.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.backend.entity.JobSeeker;
import com.jobportal.backend.service.JobSeekerService;

@RestController
@RequestMapping("/api/jobseekers")
public class JobSeekerController {

    @Autowired
    private JobSeekerService service;

    @PostMapping("/add")
    public JobSeeker addJobSeeker(@RequestBody JobSeeker jobSeeker) {
        return service.addJobSeeker(jobSeeker);
    }

    @GetMapping
    public List<JobSeeker> getAllJobSeekers() {
        return service.getAllJobSeekers();
    }

    @GetMapping("/{id}")
    public Optional<JobSeeker> getJobSeekerById(@PathVariable Long id) {
        return service.getJobSeekerById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteJobSeeker(@PathVariable Long id) {
        service.deleteJobSeeker(id);
        return "Job Seeker deleted successfully!";
    }
}

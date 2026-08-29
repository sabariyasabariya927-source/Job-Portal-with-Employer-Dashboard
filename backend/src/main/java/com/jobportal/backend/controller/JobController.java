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

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.service.JobService;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService service;

    @PostMapping("/add")
    public Job addJob(@RequestBody Job job) {
        return service.addJob(job);
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return service.getAllJobs();
    }

    @GetMapping("/{id}")
    public Optional<Job> getJobById(@PathVariable Long id) {
        return service.getJobById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable Long id) {
        service.deleteJob(id);
        return "Job deleted successfully!";
    }
}

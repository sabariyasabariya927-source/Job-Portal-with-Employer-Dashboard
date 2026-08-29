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

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.service.ApplicationService;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService service;

    @PostMapping("/add")
    public Application addApplication(@RequestBody Application application) {
        return service.addApplication(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return service.getAllApplications();
    }

    @GetMapping("/{id}")
    public Optional<Application> getApplicationById(@PathVariable Long id) {
        return service.getApplicationById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Long id) {
        service.deleteApplication(id);
        return "Application deleted successfully!";
    }
}


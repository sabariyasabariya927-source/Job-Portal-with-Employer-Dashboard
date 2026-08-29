package com.jobportal.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jobportal.backend.entity.Employer;
import com.jobportal.backend.repository.EmployerRepository;

@RestController
@RequestMapping("/api/employers")
public class EmployerController {

    @Autowired
    private EmployerRepository repo;

    @PostMapping("/add")
    public Employer addEmployer(@RequestBody Employer employer) {
        return repo.save(employer);
    }

    @GetMapping
    public List<Employer> getAllEmployers() {
        return repo.findAll();
    }
}

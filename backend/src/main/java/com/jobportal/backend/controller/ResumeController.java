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

import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.service.ResumeService;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService service;

    @PostMapping("/add")
    public Resume addResume(@RequestBody Resume resume) {
        return service.addResume(resume);
    }

    @GetMapping
    public List<Resume> getAllResumes() {
        return service.getAllResumes();
    }

    @GetMapping("/{id}")
    public Optional<Resume> getResumeById(@PathVariable Long id) {
        return service.getResumeById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteResume(@PathVariable Long id) {
        service.deleteResume(id);
        return "Resume deleted successfully!";
    }
}


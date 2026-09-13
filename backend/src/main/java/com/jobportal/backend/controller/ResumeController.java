package com.jobportal.backend.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.service.ResumeService;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "http://localhost:3000")
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

    @PatchMapping("/{id}")
    public Resume updateResume(
            @PathVariable Long id,
            @RequestBody Resume resume) {

        return service.updateResume(id, resume);
    }

    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadResume(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {

        try {

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("Please select a PDF file.");
            }

            if (file.getOriginalFilename() == null ||
                !file.getOriginalFilename().toLowerCase().endsWith(".pdf")) {

                return ResponseEntity.badRequest()
                        .body("Only PDF files are allowed.");
            }

            Resume resume = service.uploadResume(id, file);

            if (resume == null) {
                return ResponseEntity.badRequest()
                        .body("Resume not found or upload failed.");
            }

            return ResponseEntity.ok(resume);

        } catch (IOException e) {

            return ResponseEntity.internalServerError()
                    .body("File upload failed.");
        }
    }

    @DeleteMapping("/{id}")
    public String deleteResume(@PathVariable Long id) {
        service.deleteResume(id);
        return "Resume deleted successfully!";
    }
}
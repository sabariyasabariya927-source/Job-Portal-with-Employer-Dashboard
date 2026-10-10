
package com.jobportal.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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

    @GetMapping("/{id}/view")
    public ResponseEntity<Resource> viewResume(@PathVariable Long id)
            throws IOException {

        Resume resume = service.getResumeById(id).orElse(null);

        if (resume == null || resume.getFilePath() == null
                || resume.getFilePath().isBlank()) {
            return ResponseEntity.notFound().build();
        }

        String fileName = Paths.get(resume.getFilePath())
                .getFileName().toString();

        Path filePath = Paths.get("uploads", "resumes")
                .resolve(fileName).normalize();

        if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public String deleteResume(@PathVariable Long id) {
        service.deleteResume(id);
        return "Resume deleted successfully!";
    }
}
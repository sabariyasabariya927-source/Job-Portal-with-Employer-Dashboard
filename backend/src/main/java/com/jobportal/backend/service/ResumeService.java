package com.jobportal.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.backend.entity.Resume;
import com.jobportal.backend.repository.ResumeRepository;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository repo;

    public Resume addResume(Resume resume) {
        return repo.save(resume);
    }

    public List<Resume> getAllResumes() {
        return repo.findAll();
    }

    public Optional<Resume> getResumeById(Long id) {
        return repo.findById(id);
    }

    public Resume updateResume(Long id, Resume updatedResume) {

        Optional<Resume> result = repo.findById(id);

        if (result.isPresent()) {

            Resume resume = result.get();

            resume.setSkills(updatedResume.getSkills());
            resume.setEducation(updatedResume.getEducation());
            resume.setExperience(updatedResume.getExperience());

            return repo.save(resume);
        }

        return null;
    }

    public Resume uploadResume(Long id, MultipartFile file) throws IOException {

        Optional<Resume> result = repo.findById(id);

        if (result.isEmpty()) {
            return null;
        }

        if (file.isEmpty()) {
            return null;
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null || !fileName.toLowerCase().endsWith(".pdf")) {
            return null;
        }

        Path uploadPath = Paths.get("uploads/resumes");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String newFileName = UUID.randomUUID() + ".pdf";

        Path filePath = uploadPath.resolve(newFileName);

        Files.copy(
            file.getInputStream(),
            filePath,
            StandardCopyOption.REPLACE_EXISTING
        );

        Resume resume = result.get();

        resume.setFilePath("/uploads/resumes/" + newFileName);

        return repo.save(resume);
    }

    public void deleteResume(Long id) {
        repo.deleteById(id);
    }
}
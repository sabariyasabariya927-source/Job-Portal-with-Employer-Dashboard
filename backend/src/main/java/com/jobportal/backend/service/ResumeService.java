package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public void deleteResume(Long id) {
        repo.deleteById(id);
    }
}


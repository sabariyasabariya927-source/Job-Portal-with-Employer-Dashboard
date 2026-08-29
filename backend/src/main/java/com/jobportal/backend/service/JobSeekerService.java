package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.backend.entity.JobSeeker;
import com.jobportal.backend.repository.JobSeekerRepository;

@Service
public class JobSeekerService {

    @Autowired
    private JobSeekerRepository repo;

    // 🔹 Add JobSeeker
    public JobSeeker addJobSeeker(JobSeeker jobSeeker) {
        return repo.save(jobSeeker);
    }

    // 🔹 Get all JobSeekers
    public List<JobSeeker> getAllJobSeekers() {
        return repo.findAll();
    }

    // 🔹 Get JobSeeker by ID
    public Optional<JobSeeker> getJobSeekerById(Long id) {
        return repo.findById(id);
    }

    // 🔹 Delete JobSeeker
    public void deleteJobSeeker(Long id) {
        repo.deleteById(id);
    }
}

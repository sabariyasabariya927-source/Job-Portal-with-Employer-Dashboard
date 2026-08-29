package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.backend.entity.Job;
import com.jobportal.backend.repository.JobRepository;

@Service
public class JobService {

    @Autowired
    private JobRepository repo;

    public Job addJob(Job job) {
        return repo.save(job);
    }

    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    public Optional<Job> getJobById(Long id) {
        return repo.findById(id);
    }

    public void deleteJob(Long id) {
        repo.deleteById(id);
    }
}

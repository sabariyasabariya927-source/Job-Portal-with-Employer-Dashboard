package com.jobportal.backend.service;

import com.jobportal.backend.entity.Application;
import com.jobportal.backend.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository repo;

    public Application addApplication(Application application) {
        return repo.save(application);
    }

    public List<Application> getAllApplications() {
        return repo.findAll();
    }

    public Optional<Application> getApplicationById(Long id) {
        return repo.findById(id);
    }

    public void deleteApplication(Long id) {
        repo.deleteById(id);
    }
}


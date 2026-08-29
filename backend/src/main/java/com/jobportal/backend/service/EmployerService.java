package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.backend.entity.Employer;
import com.jobportal.backend.repository.EmployerRepository;

@Service
public class EmployerService {

    @Autowired
    private EmployerRepository repo;

    // 🔹 Add Employer
    public Employer addEmployer(Employer employer) {
        return repo.save(employer);
    }

    // 🔹 Get All Employers
    public List<Employer> getAllEmployers() {
        return repo.findAll();
    }

    // 🔹 Get Employer by ID
    public Optional<Employer> getEmployerById(Long id) {
        return repo.findById(id);
    }

    // 🔹 Delete Employer
    public void deleteEmployer(Long id) {
        repo.deleteById(id);
    }
}


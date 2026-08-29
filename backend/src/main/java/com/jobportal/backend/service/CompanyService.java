package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.backend.entity.Company;
import com.jobportal.backend.repository.CompanyRepository;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository repo;

    public Company addCompany(Company company) {
        return repo.save(company);
    }

    public List<Company> getAllCompanies() {
        return repo.findAll();
    }

    public Optional<Company> getCompanyById(Long id) {
        return repo.findById(id);
    }

    public void deleteCompany(Long id) {
        repo.deleteById(id);
    }
}


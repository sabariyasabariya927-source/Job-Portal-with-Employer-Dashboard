package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.Company;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}


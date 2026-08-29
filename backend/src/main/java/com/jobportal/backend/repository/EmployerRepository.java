package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.Employer;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
}

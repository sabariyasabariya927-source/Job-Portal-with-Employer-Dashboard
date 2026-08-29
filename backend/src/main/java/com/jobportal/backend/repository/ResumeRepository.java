package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}


package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.JobSeeker;

public interface JobSeekerRepository extends JpaRepository<JobSeeker, Long> {
}


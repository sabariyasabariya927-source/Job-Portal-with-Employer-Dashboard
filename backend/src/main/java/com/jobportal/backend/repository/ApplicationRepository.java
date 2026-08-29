package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.Application;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}


package com.jobportal.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.jobportal.backend.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}


package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.backend.entity.Category;
import com.jobportal.backend.repository.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository repo;

    public Category addCategory(Category category) {
        return repo.save(category);
    }

    public List<Category> getAllCategories() {
        return repo.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return repo.findById(id);
    }

    public void deleteCategory(Long id) {
        repo.deleteById(id);
    }
}

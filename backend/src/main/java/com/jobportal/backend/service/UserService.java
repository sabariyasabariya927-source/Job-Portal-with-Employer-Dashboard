package com.jobportal.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    // 🔹 Register new user
    public User registerUser(User user) {
        return repo.save(user);
    }

    // 🔹 Get all users
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // 🔹 Get user by email
    public Optional<User> getUserByEmail(String email) {
        return repo.findByEmail(email);
    }

    // 🔹 Delete user by ID
    public void deleteUser(Long id) {
        repo.deleteById(id);
    }
}


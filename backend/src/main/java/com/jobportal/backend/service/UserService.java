
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

    @Autowired
    private PasswordService passwordService;

    public User registerUser(User user) {
        if (user.getPassword() != null
                && !passwordService.isEncoded(user.getPassword())) {
            user.setPassword(passwordService.encode(user.getPassword()));
        }
        return repo.save(user);
    }

    public List<User> getAllUsers() {
        return repo.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return repo.findByEmail(email);
    }

    public void deleteUser(Integer id) {
        repo.deleteById(id);
    }
}

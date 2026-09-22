package com.jobportal.backend.controller;

import java.util.List;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // Register new user
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by email
    @GetMapping("/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()
                && existingUser.get().getPassword().equals(user.getPassword())) {

            return ResponseEntity.ok(
                Map.of(
                    "success", true,
                    "message", "Login successful",
                    "role", existingUser.get().getRole()
                )
            );
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                    Map.of(
                        "success", false,
                        "message", "Invalid email or password"
                    )
                );
    }

    // Forgot password
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> data) {

        String email = data.get("email");
        String newPassword = data.get("newPassword");

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                        Map.of(
                            "success", false,
                            "message", "Email not found"
                        )
                    );
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                        Map.of(
                            "success", false,
                            "message", "New password is required"
                        )
                    );
        }

        User user = existingUser.get();

        user.setPassword(newPassword);

        userRepository.save(user);

        return ResponseEntity.ok(
            Map.of(
                "success", true,
                "message", "Password reset successfully"
            )
        );
    }
}
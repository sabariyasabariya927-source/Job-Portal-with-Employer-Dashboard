package com.jobportal.backend.controller;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.service.EmailService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // Register new user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                        Map.of(
                            "success", false,
                            "message", "Email already registered"
                        )
                    );
        }

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("JOBSEEKER");
        } else {
            user.setRole(user.getRole().toUpperCase());
        }

        String token = UUID.randomUUID().toString();

        user.setVerified(false);
        user.setVerificationToken(token);

        User savedUser = userRepository.save(user);

        try {

            emailService.sendVerificationEmail(
                    savedUser.getEmail(),
                    token
            );

        } catch (Exception e) {

            userRepository.delete(savedUser);

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                        Map.of(
                            "success", false,
                            "message", "Unable to send verification email"
                        )
                    );
        }

        return ResponseEntity.ok(
            Map.of(
                "success", true,
                "message", "Registration successful. Please verify your email."
            )
        );
    }

    // Verify email
    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam String token) {

        Optional<User> existingUser =
                userRepository.findByVerificationToken(token);

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired verification link.");
        }

        User user = existingUser.get();

        user.setVerified(true);
        user.setVerificationToken(null);

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(
                    URI.create(
                        "https://confident-tranquility-production-e3da.up.railway.app/?verified=true"
                    )
                )
                .build();
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by email
    @GetMapping("/{email}")
    public Optional<User> getUserByEmail(
            @PathVariable String email) {

        return userRepository.findByEmail(email);
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody User user) {

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail());

        if (existingUser.isEmpty()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        Map.of(
                            "success", false,
                            "message", "Invalid email or password"
                        )
                    );
        }

        User foundUser = existingUser.get();

        if (!foundUser.getPassword().equals(user.getPassword())) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                        Map.of(
                            "success", false,
                            "message", "Invalid email or password"
                        )
                    );
        }

        if (!foundUser.isVerified()) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(
                        Map.of(
                            "success", false,
                            "message", "Please verify your email before login"
                        )
                    );
        }

        return ResponseEntity.ok(
            Map.of(
                "success", true,
                "message", "Login successful",
                "role", foundUser.getRole()
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

        if (newPassword == null ||
                newPassword.trim().isEmpty()) {

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
package com.jobportal.backend.controller;

import java.net.URI;
import java.util.HashMap;
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
import com.jobportal.backend.service.PasswordService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (user.getName() == null || user.getName().trim().isEmpty()
                || user.getEmail() == null || user.getEmail().trim().isEmpty()
                || user.getPassword() == null || user.getPassword().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false,
                            "message", "Name, email and password are required"));
        }

        String email = user.getEmail().trim();

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("success", false,
                            "message", "Email already registered"));
        }

        user.setEmail(email);

        
String role = user.getRole();

if (role == null || role.trim().isEmpty()) {
    user.setRole("JOBSEEKER");
} else {
    role = role.trim().toUpperCase();

    if (!role.equals("JOBSEEKER") && !role.equals("EMPLOYER")) {
        return ResponseEntity.badRequest().body(
                Map.of("success", false,
                        "message", "Invalid role. Choose JOBSEEKER or EMPLOYER."));
    }

    user.setRole(role);
}

        user.setPassword(passwordService.encode(user.getPassword()));
        user.setVerified(false);
        user.setVerificationToken(UUID.randomUUID().toString());

        User savedUser = userRepository.save(user);

        try {
            emailService.sendVerificationEmail(
                    savedUser.getEmail(),
                    savedUser.getVerificationToken());
        } catch (Exception e) {
            userRepository.delete(savedUser);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("success", false,
                            "message", "Unable to send verification email"));
        }

        return ResponseEntity.ok(
                Map.of("success", true,
                        "message", "Registration successful. Please verify your email."));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {

        Optional<User> existingUser =
                userRepository.findByVerificationToken(token);

        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    "Invalid or expired verification link.");
        }

        User user = existingUser.get();
        user.setVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(
                        "https://inquisitive-meerkat-a28b57.netlify.app/?verified=true"))
                .build();
    }

    @GetMapping
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::safeUserDetails)
                .toList();
    }

    @GetMapping("/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {

        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("success", false, "message", "User not found"));
        }

        return ResponseEntity.ok(safeUserDetails(existingUser.get()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false,
                            "message", "Email and password are required"));
        }

        Optional<User> existingUser =
                userRepository.findByEmail(user.getEmail().trim());

        if (existingUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("success", false,
                            "message", "Invalid email or password"));
        }

        User foundUser = existingUser.get();

        if (!passwordService.matches(
                user.getPassword(), foundUser.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    Map.of("success", false,
                            "message", "Invalid email or password"));
        }

        if (!foundUser.isVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(
                    Map.of("success", false,
                            "message", "Please verify your email before login"));
        }

        if (!passwordService.isEncoded(foundUser.getPassword())) {
            foundUser.setPassword(
                    passwordService.encode(user.getPassword()));
            userRepository.save(foundUser);
        }

        return ResponseEntity.ok(
                Map.of("success", true,
                        "message", "Login successful",
                        "role", foundUser.getRole()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @RequestBody Map<String, String> data) {

        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(
                Map.of("success", false,
                        "message",
                        "Password reset is temporarily unavailable."));
    }

    private Map<String, Object> safeUserDetails(User user) {
        Map<String, Object> data = new HashMap<>();
        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("verified", user.isVerified());
        return data;
    }
}

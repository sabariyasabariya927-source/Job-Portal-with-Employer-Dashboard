
package com.jobportal.backend.controller;

import java.time.LocalDateTime;
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
            e.printStackTrace();
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
                        "https://magenta-platypus-752473.netlify.app/?verified=true"))
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

        String email = data.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false,
                            "message", "Email is required"));
        }

        Optional<User> existingUser =
                userRepository.findByEmail(email.trim());

        if (existingUser.isPresent()
                && existingUser.get().isVerified()) {

            User user = existingUser.get();

            String token = UUID.randomUUID().toString();

            user.setPasswordResetToken(token);
            user.setPasswordResetExpiry(
                    LocalDateTime.now().plusMinutes(15));

            userRepository.save(user);

            try {
                emailService.sendPasswordResetEmail(
                        user.getEmail(), token);
            } catch (Exception e) {
                e.printStackTrace();

                user.setPasswordResetToken(null);
                user.setPasswordResetExpiry(null);
                userRepository.save(user);

                return ResponseEntity.internalServerError().body(
                        Map.of("success", false,
                                "message", "Unable to send reset email"));
            }
        }

        return ResponseEntity.ok(
                Map.of("success", true,
                        "message",
                        "If the account exists, a reset email will be sent."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody Map<String, String> data) {

        String token = data.get("token");
        String newPassword = data.get("newPassword");

        if (token == null || newPassword == null
                || newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false,
                            "message", "Valid token and password of at least 8 characters are required"));
        }

        Optional<User> existingUser =
                userRepository.findByPasswordResetToken(token);

        if (existingUser.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false,
                            "message", "Invalid reset link"));
        }

        User user = existingUser.get();

        if (user.getPasswordResetExpiry() == null
                || user.getPasswordResetExpiry().isBefore(
                        LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false,
                            "message", "Reset link expired. Request a new link."));
        }

        user.setPassword(passwordService.encode(newPassword));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("success", true,
                        "message", "Password reset successful. Please login."));
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

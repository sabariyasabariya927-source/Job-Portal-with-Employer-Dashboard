
package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.io.IOException;

@Service
public class EmailService {

    @Value("${RESEND_API_KEY}")
    private String apiKey;

    private final HttpClient client = HttpClient.newHttpClient();

    public void sendVerificationEmail(String email, String token) {

        String link = "https://job-portal-with-employer-dashboard-q1kn.onrender.com/api/users/verify?token=" + token;

        String message = "Welcome to Job Portal!\n\n"
                + "Please click the link below to verify your email:\n\n"
                + link
                + "\n\nAfter verification, you can login to your account.";

        sendEmail(email, "Verify your Job Portal Account", message);
    }

    public void sendPasswordResetEmail(String email, String token) {

        String link = "https://magenta-platypus-752473.netlify.app/reset-password?token=" + token;

        String message = "Password Reset Request\n\n"
                + "Click the link below to reset your Job Portal password:\n\n"
                + link
                + "\n\nThis link expires in 15 minutes."
                + "\n\nIf you did not request this, ignore this email.";

        sendEmail(email, "Reset Your Job Portal Password", message);
    }

    private void sendEmail(String email, String subject, String message) {

        String body = "{"
                + "\"from\":\"Job Portal <onboarding@resend.dev>\","
                + "\"to\":[\"" + escapeJson(email) + "\"],"
                + "\"subject\":\"" + escapeJson(subject) + "\","
                + "\"text\":\"" + escapeJson(message) + "\""
                + "}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.resend.com/emails"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .header("User-Agent", "JobPortal/1.0")
                .POST(HttpRequest.BodyPublishers.ofString(body))
                .build();

        try {
            HttpResponse<String> response = client.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("Resend error: " + response.body());
            }

        } catch (IOException e) {
            throw new RuntimeException("Email sending failed", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Email sending interrupted", e);
        }
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r");
    }
}

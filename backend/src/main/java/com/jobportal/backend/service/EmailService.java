package com.jobportal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String email, String token) {

        String link =
                "https://job-portal-with-employer-dashboard-production.up.railway.app/api/users/verify?token="
                + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Verify your Job Portal Account");

        message.setText(
                "Welcome to Job Portal!\n\n"
                + "Please click the link below to verify your email:\n\n"
                + link
                + "\n\n"
                + "After verification, you can login to your account."
        );

        mailSender.send(message);
    }
}
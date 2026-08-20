//package com.rishit.financetracker.services;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class EmailService {
//
//    private final JavaMailSender mailSender;
//
//    @Value("${spring.mail.username}")
//    private String fromEmail;
//    public void sendOverspendingAlert(String toemail, String category, double spent, double limit) {
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toemail);
//        message.setSubject("Budget Alert !");
//
//        message.setText(
//                "You have exceeded your budget for category: " + category +
//                        "\n\nSpent: " + spent +
//                        "\nLimit: " + limit +
//                        "\n\nPlease review your spending."
//        );
//
//        mailSender.send(message);
//    }
//}

package com.rishit.financetracker.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // Read sender email from application.properties
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOverspendingAlert(
            String toEmail,
            String category,
            double spent,
            double limit
    ) {

        System.out.println("Preparing email alert...");

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("🚨 Budget Overspending Alert - " + category);

        message.setText(
                "Hello,\n\n" +
                        "You have exceeded your monthly budget for the \"" + category + "\" category.\n\n" +
                        "Spent Amount: ₹" + spent + "\n" +
                        "Budget Limit: ₹" + limit + "\n\n" +
                        "Please review your expenses in this category to stay within your budget.\n\n" +
                        "Finance Tracker"
        );

        System.out.println("Sending email from: " + fromEmail);
        System.out.println("Sending email to: " + toEmail);

        mailSender.send(message);

        System.out.println("Email alert sent successfully.");
    }
}
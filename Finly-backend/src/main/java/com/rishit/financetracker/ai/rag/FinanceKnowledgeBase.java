package com.rishit.financetracker.ai.rag;


import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class FinanceKnowledgeBase {

    private final Map<String, String> knowledge = Map.of(
            "FOOD", "Try reducing food expenses by cooking at home and limiting online orders.",
            "RENT", "Keep rent under 30% of your income if possible.",
            "SAVINGS", "Aim to save at least 20% of your monthly income.",
            "TRAVEL", "Plan trips in advance to reduce travel costs.",
            "SHOPPING", "Avoid impulse buying and track unnecessary purchases."
    );

    public String getAdvice(String category) {
        return knowledge.getOrDefault(category.toUpperCase(), "");
    }
}
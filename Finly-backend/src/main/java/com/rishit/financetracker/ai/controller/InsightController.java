package com.rishit.financetracker.ai.controller;

import com.rishit.financetracker.ai.service.FinancialInsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightController {

    private final FinancialInsightService insightService;

    @GetMapping("/trend")
    public String trend(@RequestParam String userId,
                        @RequestParam String category) {

        return insightService.categoryTrendInsight(userId, category);
    }

    @GetMapping("/prediction")
    public String prediction(@RequestParam String userId) {

        return insightService.predictMonthlyExpense(userId);
    }

    @GetMapping("/budget-suggestion")
    public String suggestion(@RequestParam String userId,
                             @RequestParam String category) {

        return insightService.budgetSuggestion(userId, category);
    }
}
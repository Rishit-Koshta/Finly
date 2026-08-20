package com.rishit.financetracker.ai.service;

import com.rishit.financetracker.analytics.service.AnalyticsService;
import com.rishit.financetracker.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FinancialInsightService {

    private final AnalyticsService analyticsService;
    private final BudgetRepository budgetRepository;

    public String categoryTrendInsight(String userId, String category) {

        LocalDate now = LocalDate.now();

        int year = now.getYear();
        int month = now.getMonthValue();

        int prevMonth = month == 1 ? 12 : month - 1;
        int prevYear = month == 1 ? year - 1 : year;

        var current = analyticsService.getCategoryExpense(userId, year, month);
        var previous = analyticsService.getCategoryExpense(userId, prevYear, prevMonth);

        double currentValue = current.stream()
                .filter(c -> category.equalsIgnoreCase(c.getCategory()))
                .map(c -> c.getAmount().doubleValue())
                .findFirst()
                .orElse(0.0);

        double previousValue = previous.stream()
                .filter(c -> category.equalsIgnoreCase(c.getCategory()))
                .map(c -> c.getAmount().doubleValue())
                .findFirst()
                .orElse(0.0);

        if (previousValue == 0) {
            return "No previous data available for comparison.";
        }

        double change = ((currentValue - previousValue) / previousValue) * 100;

        return "You spent " + String.format("%.2f", change)
                + "% more on " + category + " compared to last month.";
    }

    public String predictMonthlyExpense(String userId) {

        LocalDate now = LocalDate.now();

        int year = now.getYear();
        int month = now.getMonthValue();

        var summary = analyticsService.getMonthlySummary(userId, year, month);

        double currentExpense = summary.getExpense().doubleValue();

        int dayOfMonth = now.getDayOfMonth();
        int totalDays = now.lengthOfMonth();

        double projected = (currentExpense / dayOfMonth) * totalDays;

        return "Your projected expense for this month is ₹"
                + Math.round(projected);
    }



    public String budgetSuggestion(String userId, String category) {

        com.rishit.financetracker.entity.enums.Category categoryEnum;

        try {
            categoryEnum = com.rishit.financetracker.entity.enums.Category.valueOf(category.toUpperCase());
        } catch (IllegalArgumentException e) {
            return "Unknown category: " + category;
        }

        // ✅ Get the budget set for this category
        var budgetOpt = budgetRepository.findByUserIdAndCategory(userId, categoryEnum);

        if (budgetOpt.isEmpty()) {
            return "No budget set for " + category + ". Please set a monthly budget for this category.";
        }

        var budget = budgetOpt.get();

        // ✅ Get this category's spend for the current month
        var categorySpend = analyticsService.getCategoryExpense(
                userId,
                LocalDate.now().getYear(),
                LocalDate.now().getMonthValue()
        );

        double spent = categorySpend.stream()
                .filter(c -> category.equalsIgnoreCase(c.getCategory()))
                .map(c -> c.getAmount().doubleValue())
                .findFirst()
                .orElse(0.0);

        double limit = budget.getMonthlyLimit();

        // ✅ Case 1: within budget
        if (spent <= limit) {
            return "You are within your " + category + " budget. Good job!";
        }

        // ✅ Case 2: exceeded
        double excess = spent - limit;

        return "You have exceeded your " + category + " budget by ₹"
                + Math.round(excess)
                + ". Consider reducing unnecessary expenses in this category.";
    }
}
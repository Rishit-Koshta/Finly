package com.rishit.financetracker.analytics.controller;

import com.rishit.financetracker.analytics.dto.CategoryExpenseResponse;
import com.rishit.financetracker.analytics.dto.DailyExpenseResponse;
import com.rishit.financetracker.analytics.dto.MonthlySummaryResponse;
import com.rishit.financetracker.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/monthly-summary")
    public MonthlySummaryResponse getMonthlySummary(
            @RequestParam String userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return analyticsService.getMonthlySummary(userId, year, month);
    }

    @GetMapping("/category-expense")
    public List<CategoryExpenseResponse> getCategoryExpense(
            @RequestParam String userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return analyticsService.getCategoryExpense(userId, year, month);
    }

    @GetMapping("/daily-expense-trend")
    public List<DailyExpenseResponse> getDailyExpenseTrend(
            @RequestParam String userId,
            @RequestParam int year,
            @RequestParam int month
    ) {
        return analyticsService.getDailyExpenseTrend(userId, year, month);
    }
}
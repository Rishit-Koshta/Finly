package com.rishit.financetracker.analytics.service;

import com.rishit.financetracker.analytics.dto.*;
import com.rishit.financetracker.entity.enums.TransactionType;
import com.rishit.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TransactionRepository transactionRepository;


    // Monthly Summary

    public MonthlySummaryResponse getMonthlySummary(String userId, int year, int month) {

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth()).plusDays(1);

        List<TransactionSummary> result =
                transactionRepository.getMonthlySummary(userId, startDate, endDate);

        System.out.println("Aggregation Result: " + result);

        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expense = BigDecimal.ZERO;

        for (TransactionSummary r : result) {

            System.out.println("Type: " + r.getType() + " Amount: " + r.getAmount());

            if ("INCOME".equalsIgnoreCase(r.getType())) {
                income = r.getAmount();
            }


            if ("EXPENSE".equalsIgnoreCase(r.getType())) {
                expense = r.getAmount();
            }
        }

        BigDecimal balance = income.subtract(expense);

        return new MonthlySummaryResponse(income, expense, balance);
    }


    public List<CategoryExpenseResponse> getCategoryExpense(
            String userId,
            int year,
            int month
    ) {

        ZoneId zone = ZoneId.systemDefault();

        Instant startDate = LocalDate.of(year, month, 1)
                .atStartOfDay(zone)
                .toInstant();

        Instant endDate = LocalDate.of(year, month, 1)
                .plusMonths(1)
                .atStartOfDay(zone)
                .toInstant();


        List<CategoryExpenseResponse> result =
                transactionRepository.getCategoryExpense(
                        userId,
                        startDate,
                        endDate

                );


        return result;
    }

    // Daily Expense Trend (Line Chart)

    public List<DailyExpenseResponse> getDailyExpenseTrend(
            String userId,
            int year,
            int month
    ) {

        ZoneId zone = ZoneId.systemDefault();

        Instant startDate = LocalDate.of(year, month, 1)
                .atStartOfDay(zone)
                .toInstant();

        Instant endDate = LocalDate.of(year, month, 1)
                .plusMonths(1)
                .atStartOfDay(zone)
                .toInstant();

        List<DailyExpenseResponse> results =
                transactionRepository.getDailyExpenseTrend(
                        userId,
                        startDate,
                        endDate
                );


        return results.stream()
                .map(r -> new DailyExpenseResponse(
                        r.getDate(),
                        r.getAmount()
                ))
                .toList();
    }
}
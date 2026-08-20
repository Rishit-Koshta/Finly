package com.rishit.financetracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;



@Data
@AllArgsConstructor
public class DailyExpenseResponse {

    private LocalDate date;
    private BigDecimal amount;

}
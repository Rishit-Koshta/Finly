package com.rishit.financetracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class MonthlySummaryResponse {

    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;
}
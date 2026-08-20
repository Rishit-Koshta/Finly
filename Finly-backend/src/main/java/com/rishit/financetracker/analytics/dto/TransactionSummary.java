package com.rishit.financetracker.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionSummary {

    private String type;
    private BigDecimal amount;

}
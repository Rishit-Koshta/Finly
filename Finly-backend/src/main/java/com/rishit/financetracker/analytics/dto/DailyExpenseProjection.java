package com.rishit.financetracker.analytics.dto;

import java.math.BigDecimal;
import java.time.LocalDate;


public interface DailyExpenseProjection {

    LocalDate getDate();

    BigDecimal getAmount();

}
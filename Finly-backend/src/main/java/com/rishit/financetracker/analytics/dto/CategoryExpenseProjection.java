package com.rishit.financetracker.analytics.dto;

import java.math.BigDecimal;

public interface CategoryExpenseProjection {

    String getId();   // category name
    BigDecimal getTotal();
}

package com.rishit.financetracker.dto;

import com.rishit.financetracker.entity.enums.Category;
import com.rishit.financetracker.entity.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponseDTO {

    private String id;

    private String title;

    private BigDecimal amount;

    private TransactionType type;

    private Category category;

    private LocalDate date;

    private String note;
}

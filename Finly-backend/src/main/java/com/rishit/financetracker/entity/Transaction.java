package com.rishit.financetracker.entity;
import com.rishit.financetracker.entity.enums.TransactionType;
import com.rishit.financetracker.entity.enums.Category;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String userId; // Reference to User document

    private String title;

    private BigDecimal amount;  // Always use BigDecimal for money

    private TransactionType type;

    private Category category;

    private LocalDate date;

    private String note;
}

package com.rishit.financetracker.entity;

import com.rishit.financetracker.entity.enums.Category;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "budgets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Budget {

    @Id
    private String id;

    private String userId;

    // Each budget document now belongs to a single category,
    // instead of one overall limit per user.
    private Category category;

    private Double monthlyLimit;
}

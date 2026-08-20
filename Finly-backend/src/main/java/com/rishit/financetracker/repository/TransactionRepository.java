package com.rishit.financetracker.repository;

import com.rishit.financetracker.analytics.dto.*;
import com.rishit.financetracker.entity.Transaction;
import com.rishit.financetracker.entity.enums.TransactionType;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {

    // Get all transactions of a user
    List<Transaction> findByUserId(String userId);

    // Get transactions by type (INCOME / EXPENSE)
    List<Transaction> findByUserIdAndType(String userId, TransactionType type);

    // Get transactions between date range
    List<Transaction> findByUserIdAndDateBetween(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );
    @Aggregation(pipeline = {
            "{ $match: { userId: ?0, date: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { _id: \"$type\", amount: { $sum: \"$amount\" } } }",
            "{ $project: { type: \"$_id\", amount: 1, _id: 0 } }"
    })
    List<TransactionSummary> getMonthlySummary(
            String userId,
            LocalDate startDate,
            LocalDate endDate
    );

//
@Aggregation(pipeline = {
        "{ $match: { userId: ?0 } }",
        "{ $match: { type: { $regex: '^expense$', $options: 'i' } } }",
        "{ $group: { _id: \"$category\", amount: { $sum: \"$amount\" } } }",
        "{ $project: { category: \"$_id\", amount: 1, _id: 0 } }"
})
List<CategoryExpenseResponse> getCategoryExpense(
        String userId,
        Instant startDate,
        Instant endDate
//        TransactionType type
);

    @Aggregation(pipeline = {
            "{ $match: { userId: ?0 } }",
            "{ $match: { type: { $regex: '^expense$', $options: 'i' } } }",
            "{ $group: { _id: \"$date\", amount: { $sum: \"$amount\" } } }",
            "{ $project: { date: \"$_id\", amount: 1, _id: 0 } }",
            "{ $sort: { date: 1 } }"
    })
    List<DailyExpenseResponse> getDailyExpenseTrend(
            String userId,
            Instant startDate,
            Instant endDate
    );

}

package com.rishit.financetracker.repository;

import com.rishit.financetracker.entity.Budget;
import com.rishit.financetracker.entity.enums.Category;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends MongoRepository<Budget, String> {

    // get the budget set for one specific category
    Optional<Budget> findByUserIdAndCategory(String userId, Category category);

    // get every category budget belonging to a user
    List<Budget> findByUserId(String userId);

    void deleteByUserIdAndCategory(String userId, Category category);
}

package com.rishit.financetracker.controller;

import com.rishit.financetracker.entity.Budget;
import com.rishit.financetracker.entity.enums.Category;
import com.rishit.financetracker.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetRepository budgetRepository;

    // create or update the budget for whichever category is in the request body
    @PostMapping
    public Budget createOrUpdateBudget(@RequestBody Budget budget) {

        Optional<Budget> existing = budgetRepository
                .findByUserIdAndCategory(budget.getUserId(), budget.getCategory());

        if (existing.isPresent()) {
            Budget old = existing.get();
            old.setMonthlyLimit(budget.getMonthlyLimit());
            return budgetRepository.save(old);
        }

        return budgetRepository.save(budget);
    }

    // get every category budget a user has set
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Budget>> getBudgets(@PathVariable String userId) {

        return ResponseEntity.ok(budgetRepository.findByUserId(userId));
    }

    // get the budget for just one category
    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<Budget> getBudgetByCategory(
            @PathVariable String userId,
            @PathVariable Category category
    ) {
        return budgetRepository.findByUserIdAndCategory(userId, category)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // remove the budget set for one category
    @DeleteMapping("/user/{userId}/category/{category}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable String userId,
            @PathVariable Category category
    ) {
        budgetRepository.deleteByUserIdAndCategory(userId, category);
        return ResponseEntity.noContent().build();
    }
}

package com.rishit.financetracker.services;

import com.rishit.financetracker.analytics.service.AnalyticsService;
import com.rishit.financetracker.dto.TransactionRequestDTO;
import com.rishit.financetracker.dto.TransactionResponseDTO;
import com.rishit.financetracker.entity.Transaction;
import com.rishit.financetracker.entity.enums.TransactionType;
import com.rishit.financetracker.exceptions.ResourceNotFoundException;
import com.rishit.financetracker.repository.BudgetRepository;
import com.rishit.financetracker.repository.TransactionRepository;
import com.rishit.financetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final EmailService emailService;
    private final UserRepository userRepository;
    private final AnalyticsService analyticsService;

    //  Create Transaction
    public TransactionResponseDTO createTransaction(TransactionRequestDTO dto) {

        Transaction transaction = mapToEntity(dto);

        Transaction saved = transactionRepository.save(transaction);

        checkBudgetAndNotify(saved);

        return mapToResponseDTO(saved);
    }

    private void checkBudgetAndNotify(Transaction transaction) {

        // ✅ Only for expenses
        if (transaction.getType() != TransactionType.EXPENSE) {
            return;
        }

        var category = transaction.getCategory();

        // ✅ Get user's budget for this specific category
        var budgetOpt = budgetRepository.findByUserIdAndCategory(transaction.getUserId(), category);

        if (budgetOpt.isEmpty()) {
            return;
        }

        var budget = budgetOpt.get();

        // ✅ Get this category's spend for the transaction's month
        double spent = getCategorySpendForMonth(
                transaction.getUserId(),
                category,
                transaction.getDate()
        );

        double limit = budget.getMonthlyLimit();

        if (spent > limit) {

            System.out.println("Overspending detected for category: " + category);

            String email = userRepository
                    .findById(transaction.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getEmail();

            emailService.sendOverspendingAlert(
                    email,
                    category.name(),
                    spent,
                    limit
            );
        }
    }

    // ✅ Sums this month's expenses for one category
    private double getCategorySpendForMonth(String userId, com.rishit.financetracker.entity.enums.Category category, LocalDate date) {

        LocalDate startOfMonth = date.withDayOfMonth(1);
        LocalDate endOfMonth = startOfMonth.withDayOfMonth(startOfMonth.lengthOfMonth());

        return transactionRepository
                .findByUserIdAndDateBetween(userId, startOfMonth, endOfMonth)
                .stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .filter(t -> t.getCategory() == category)
                .map(Transaction::getAmount)
                .mapToDouble(java.math.BigDecimal::doubleValue)
                .sum();
    }

    //  Get All Transactions By User
    public List<TransactionResponseDTO> getTransactionsByUser(String userId) {

        return transactionRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    //  Get Transaction By ID
    public TransactionResponseDTO getTransactionById(String id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + id));

        return mapToResponseDTO(transaction);
    }

    //  Update Transaction
    public TransactionResponseDTO updateTransaction(String id,
                                                    TransactionRequestDTO dto) {

        Transaction existing = transactionRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("Transaction not found with id: " + id));

        existing.setTitle(dto.getTitle());
        existing.setAmount(dto.getAmount());
        existing.setType(dto.getType());
        existing.setCategory(dto.getCategory());
        existing.setDate(dto.getDate());
        existing.setNote(dto.getNote());

        Transaction updated = transactionRepository.save(existing);

        return mapToResponseDTO(updated);
    }

    //  Delete Transaction
    public void deleteTransaction(String id) {

        if (!transactionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Transaction not found with id: " + id);
        }

        transactionRepository.deleteById(id);
    }

    //  Mapping Methods

    private Transaction mapToEntity(TransactionRequestDTO dto) {
        return Transaction.builder()
                .userId(dto.getUserId())
                .title(dto.getTitle())
                .amount(dto.getAmount())
                .type(dto.getType())
                .category(dto.getCategory())
                .date(dto.getDate())
                .note(dto.getNote())
                .build();
    }

    private TransactionResponseDTO mapToResponseDTO(Transaction transaction) {
        return TransactionResponseDTO.builder()
                .id(transaction.getId())
                .title(transaction.getTitle())
                .amount(transaction.getAmount())
                .type(transaction.getType())
                .category(transaction.getCategory())
                .date(transaction.getDate())
                .note(transaction.getNote())
                .build();
    }
}

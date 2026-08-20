package com.rishit.financetracker.controller;

import com.rishit.financetracker.dto.TransactionRequestDTO;
import com.rishit.financetracker.dto.TransactionResponseDTO;
import com.rishit.financetracker.services.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    //  Create Transaction (WITH VALIDATION)
    @PostMapping
    public ResponseEntity<TransactionResponseDTO> createTransaction(
            @Valid @RequestBody TransactionRequestDTO requestDTO) {

        return ResponseEntity.ok(transactionService.createTransaction(requestDTO));
    }

    //  Get All Transactions By User
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TransactionResponseDTO>> getTransactionsByUser(
            @PathVariable String userId) {

        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId));
    }

    //  Get Transaction By ID
    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransactionById(
            @PathVariable String id) {

        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    //  Update Transaction
    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> updateTransaction(
            @PathVariable String id,
            @Valid @RequestBody TransactionRequestDTO requestDTO) {

        return ResponseEntity.ok(transactionService.updateTransaction(id, requestDTO));
    }

    //  Delete Transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok("Transaction deleted successfully");
    }
}
package com.rishit.financetracker.ai.service;

import com.rishit.financetracker.ai.dto.AIResponse;
//import com.rishit.financetracker.ai.rag.RAGService;
import com.rishit.financetracker.ai.rag.RAGService;
import com.rishit.financetracker.analytics.service.AnalyticsService;
import com.rishit.financetracker.dto.TransactionRequestDTO;
import com.rishit.financetracker.entity.enums.Category;
import com.rishit.financetracker.entity.enums.TransactionType;
import com.rishit.financetracker.repository.BudgetRepository;
import com.rishit.financetracker.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FinanceAIService {

    private final NLPService nlpService;
    private final TransactionService transactionService;

    private final RAGService ragService;

    private final GroqService groqService;
    private final FinancialContextService contextService;

    public String askFinanceAI(String userId, String question) {

        String intent = nlpService.detectIntent(question);

        // ✅ GREETING
        if ("GREETING".equals(intent)) {
            return "Hello! How can I help you with your finances today?";
        }

        // ✅ ADD TRANSACTION (NO AI CALL)
        if ("ADD_TRANSACTION".equals(intent)) {

            Map<String, Object> data = nlpService.extractTransaction(question);

            if (!data.containsKey("amount")) {
                return "I couldn't detect the amount. Please try again.";
            }

            TransactionRequestDTO dto = TransactionRequestDTO.builder()
                    .userId(userId)
                    .title((String) data.get("title"))
                    .amount((BigDecimal) data.get("amount"))
                    .type((TransactionType) data.get("type"))
                    .category((Category) data.get("category"))
                    .date(LocalDate.now())
                    .note(question)
                    .build();

            transactionService.createTransaction(dto);

            return "Transaction added successfully!";
        }

        // ✅ DEFAULT → AI
        String context = contextService.buildContext(userId);

// 🔥 RAG retrieval
        String knowledge = ragService.retrieve(question);

        System.out.println("🔍 RAG Knowledge:\n" + knowledge); // debug

        String prompt = """
            You are a personal finance assistant.

            RULES:
            - No markdown, no **, no bullets with symbols
            - Use simple plain text with short sections
            - Keep answers concise (5–8 lines max)
            - Use Indian Rupees format when needed (₹)
            - Base your answer strictly on provided data

            Relevant financial knowledge:
            %s

            User financial data:
            %s

            Question:
            %s

            Give clear, actionable advice.
            """.formatted(knowledge, context, question);

        try {
            return groqService.generate(prompt);
        } catch (Exception e) {
            return "I'm having trouble generating insights right now. Please try again.";
        }
    }
}
package com.rishit.financetracker.ai.controller;

import com.rishit.financetracker.ai.dto.AIRequest;
import com.rishit.financetracker.ai.dto.AIResponse;
import com.rishit.financetracker.ai.service.FinanceAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final FinanceAIService aiService;

    @PostMapping("/ask")
    public AIResponse ask(@RequestBody AIRequest request) {

        String answer = aiService.askFinanceAI(
                request.getUserId(),
                request.getQuestion()
        );

        return new AIResponse(answer);
    }
}
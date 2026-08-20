package com.rishit.financetracker.ai.rag;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class KnowledgeDocument {
    private String content;
    private List<Double> embedding;
}
package com.rishit.financetracker.ai.rag;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class KnowledgeLoader {

    private final EmbeddingService embeddingService;
    private final VectorStore vectorStore;

    @PostConstruct
    public void load() {

        List<String> docs = List.of(
                "Reduce food expenses by cooking at home",
                "Keep rent below 30 percent of income",
                "Save at least 20 percent monthly",
                "Avoid impulse shopping",
                "Track travel expenses carefully"
        );

        for (String text : docs) {
            List<Double> embedding = embeddingService.getEmbedding(text);
            vectorStore.add(new KnowledgeDocument(text, embedding));
        }
    }
}
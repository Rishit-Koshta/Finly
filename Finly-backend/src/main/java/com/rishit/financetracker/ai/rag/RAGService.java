package com.rishit.financetracker.ai.rag;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RAGService {

    private final EmbeddingService embeddingService;
    private final VectorStore vectorStore;

    public String retrieve(String query) {

        List<Double> queryEmbedding = embeddingService.getEmbedding(query);

        List<KnowledgeDocument> results = vectorStore.search(queryEmbedding);

        return results.stream()
                .map(KnowledgeDocument::getContent)
                .collect(Collectors.joining("\n"));
    }
}
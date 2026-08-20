package com.rishit.financetracker.ai.rag;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VectorStore {

    private final List<KnowledgeDocument> documents = new ArrayList<>();

    public void add(KnowledgeDocument doc) {
        documents.add(doc);
    }

    public List<KnowledgeDocument> search(List<Double> queryEmbedding) {

        return documents.stream()
                .sorted((d1, d2) -> Double.compare(
                        cosineSimilarity(queryEmbedding, d2.getEmbedding()),
                        cosineSimilarity(queryEmbedding, d1.getEmbedding())
                ))
                .limit(3)
                .toList();
    }

    private double cosineSimilarity(List<Double> a, List<Double> b) {
        double dot = 0, normA = 0, normB = 0;

        for (int i = 0; i < a.size(); i++) {
            dot += a.get(i) * b.get(i);
            normA += Math.pow(a.get(i), 2);
            normB += Math.pow(b.get(i), 2);
        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

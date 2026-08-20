package com.rishit.financetracker.ai.rag;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EmbeddingService {

    private final WebClient webClient;

    public EmbeddingService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:1234/v1") // ✅ LM Studio
                .build();
    }

    public List<Double> getEmbedding(String text) {

        Map<String, Object> body = Map.of(
                "model", "text-embedding-bge-small-en-v1.5", // ✅ exact name from LM Studio
                "input", text
        );
        JsonNode response;

        try {
            response = webClient.post()
                    .uri("/embeddings")
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(JsonNode.class)
                    .block();
        } catch (Exception e) {
            throw new RuntimeException("LM Studio not running or embedding failed", e);
        }
        if (response == null) {
            throw new RuntimeException("Embedding response is null");
        }

        JsonNode embeddingArray = response.at("/data/0/embedding");

        List<Double> embedding = new ArrayList<>();
        embeddingArray.forEach(e -> embedding.add(e.asDouble()));

        return embedding;
    }
}
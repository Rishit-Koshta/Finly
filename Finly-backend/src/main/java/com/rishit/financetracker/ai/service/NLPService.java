package com.rishit.financetracker.ai.service;

import com.rishit.financetracker.entity.enums.Category;
import com.rishit.financetracker.entity.enums.TransactionType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class NLPService {

    private GroqService groqService;

    public String detectIntent(String question) {

        String q = question.toLowerCase();

        if (q.matches(".*\\b(hi|hello|hey)\\b.*")) return "GREETING";

//        if (q.matches(".*\\b(spent|paid|bought|purchase)\\b.*")) {
//            return "ADD_TRANSACTION";
//        }

        if (
                (q.contains("spent") || q.contains("paid") || q.contains("bought") ||
                        q.contains("purchase") || q.contains("movie") || q.contains("ticket") ||
                        q.contains("watch") || q.contains("watched") || q.contains("add"))
                        &&
                        q.matches(".*\\d+.*") // amount must exist
        ) {
            return "ADD_TRANSACTION";
        }

        if (q.contains("budget")) return "BUDGET";

        return "GENERAL";
    }

    private Category detectCategoryUsingAI(String input) {

        String prompt = """
        Classify this expense into one category ONLY from this list:

        FOOD, RENT, TRAVEL, SHOPPING, ENTERTAINMENT, OTHER

        Rules:
        - Return ONLY the category name
        - No explanation

        Input: %s
        """.formatted(input);

        String response = groqService.generate(prompt)
                .trim()
                .toUpperCase()
                .replaceAll("[^A-Z]", ""); // 🔥 important cleanup

        try {
            return Category.valueOf(response);
        } catch (Exception e) {
            return Category.OTHER;
        }
    }

    public Map<String, Object> extractTransaction(String input) {

        Map<String, Object> data = new HashMap<>();

        String lower = input.toLowerCase();

        // ✅ Extract amount
        Matcher amountMatcher = Pattern.compile("\\d+").matcher(input);
        if (amountMatcher.find()) {
            data.put("amount", new BigDecimal(amountMatcher.group()));
        }

        // ✅ Detect category
        if (lower.contains("pizza") || lower.contains("food") || lower.contains("dominos")) {
            data.put("category", Category.FOOD);
            data.put("title", "Food Expense");
        } else if (lower.contains("rent")) {
            data.put("category", Category.RENT);
            data.put("title", "Rent Payment");
        } else if (lower.contains("travel")) {
            data.put("category", Category.TRAVEL);
            data.put("title", "Travel Expense");
        } else if (lower.contains("shopping")) {
            data.put("category", Category.SHOPPING);
            data.put("title", "Shopping");
//        } else {
//            data.put("category", Category.OTHER);
//            data.put("title", "General Expense");
//        }
        }
        else {
            Category aiCategory = detectCategoryUsingAI(input);
            data.put("category", aiCategory);
            data.put("title", aiCategory.name() + " Expense");
        }


        // ✅ Default type
        data.put("type", TransactionType.EXPENSE);

        return data;
    }
}
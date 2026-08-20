package com.rishit.financetracker.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class Users {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String name;

    private String email;

    private String password;
}

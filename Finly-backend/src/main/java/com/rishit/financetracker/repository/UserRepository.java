package com.rishit.financetracker.repository;

import com.rishit.financetracker.entity.Users;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<Users, String> {

    // Find user by email (useful for login or uniqueness check)
    Optional<Users> findByEmail(String email);

    // Check if email already exists
    boolean existsByEmail(String email);
}

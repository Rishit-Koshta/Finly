package com.rishit.financetracker.services;

import com.rishit.financetracker.dto.*;
import com.rishit.financetracker.entity.RefreshToken;
import com.rishit.financetracker.entity.Users;
import com.rishit.financetracker.exceptions.BadRequestException;
import com.rishit.financetracker.exceptions.ResourceNotFoundException;
import com.rishit.financetracker.repository.RefreshTokenRepository;
import com.rishit.financetracker.repository.UserRepository;
import com.rishit.financetracker.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;



    //Login method
    public LoginResponseDTO login(LoginRequestDTO dto) {

        Users user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        String accessToken = jwtUtil.generateToken(user.getId(), user.getEmail());

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new LoginResponseDTO(accessToken, refreshToken.getToken(), user.getId());

    }

    //refrresh token method

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid refresh token"));

        refreshTokenService.verifyExpiration(refreshToken);

        Users user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = jwtUtil.generateToken(user.getId(), user.getEmail());

        return new TokenRefreshResponse(newAccessToken, refreshToken.getToken());
    }

    // Create User
    public UserResponseDTO createUser(UserRequestDTO requestDTO) {

        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        String encryptedPassword = passwordEncoder.encode(requestDTO.getPassword());
        Users user = Users.builder()
                .name(requestDTO.getName())
                .email(requestDTO.getEmail())
                .password(encryptedPassword) // later we hash it
                .build();

        Users savedUser = userRepository.save(user);

        return mapToResponseDTO(savedUser);
    }

    // Get All Users
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get User By ID
    public UserResponseDTO getUserById(String id) {

        Users user = userRepository.findById(id)
                .orElseThrow(() ->  new ResourceNotFoundException("User not found with id: " + id));

        return mapToResponseDTO(user);
    }

    // Delete User
    public void deleteUser(String id) {

        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(id);
    }

    //  Mapping Method
    private UserResponseDTO mapToResponseDTO(Users user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}

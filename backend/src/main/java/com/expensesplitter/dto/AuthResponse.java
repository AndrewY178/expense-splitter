package com.expensesplitter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String name;
    
    // Custom constructor for convenience
    public AuthResponse(String token, Long id, String email, String name) {
        this.token = token;
        this.type = "Bearer";
        this.id = id;
        this.email = email;
        this.name = name;
    }
}


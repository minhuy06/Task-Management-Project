package com.example.task_management_project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JwtResponseDTO {
    private String token;
    private String type = "Bearer";
    private String username;

    public JwtResponseDTO(String token, String username){
        this.token = token;
        this.username = username;
    }
}

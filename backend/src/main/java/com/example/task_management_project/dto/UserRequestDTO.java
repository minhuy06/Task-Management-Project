package com.example.task_management_project.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserRequestDTO {

    @NotBlank(message = "Username cannot be left blank")
    @Size(min = 3, max = 50, message = "The username must be between 3 and 50 characters long")
    private String username;

    @NotBlank(message = "The email field cannot be left blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "The password cannot be left blank")
    @Size(min = 6, message = "The password must be at least 6 characters long")
    private String password;
}

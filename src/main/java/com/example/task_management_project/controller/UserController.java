package com.example.task_management_project.controller;

import com.example.task_management_project.dto.UserRequestDTO;
import com.example.task_management_project.dto.UserResponseDTO;
import com.example.task_management_project.entity.User;
import com.example.task_management_project.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService = userService;
    }

    // Get all user
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUser(){
        List<UserResponseDTO> response = userService.getAllUsers()
                .stream()
                .map(userService::mapToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // Get user by id
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUerById(@PathVariable Long id){
        User user = userService.getUserById(id);
        return ResponseEntity.ok(userService.mapToResponseDTO(user));
    }

    // Create user
    public ResponseEntity<UserResponseDTO> createUser(@RequestBody UserRequestDTO requestDTO){
        User user = userService.mapToEntity(requestDTO);
        User savedUser = userService.createUser(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.mapToResponseDTO(savedUser));
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO requestDTO){
        User userDetail = userService.mapToEntity(requestDTO);
        User updatedUser = userService.updateUser(id, userDetail);

        return ResponseEntity.ok(userService.mapToResponseDTO(updatedUser));
    }
    @PostMapping

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

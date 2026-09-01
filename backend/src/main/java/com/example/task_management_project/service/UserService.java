package com.example.task_management_project.service;

import com.example.task_management_project.dto.UserRequestDTO;
import com.example.task_management_project.dto.UserResponseDTO;
import com.example.task_management_project.entity.User;
import com.example.task_management_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all users
    public List<UserResponseDTO> getAllUsers(){
        return userRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Get user by id
    public UserResponseDTO getUserById(Long id){
        User user = getUserEntityById(id);
        return mapToResponseDTO(user);
    }

    // Create new user
    public UserResponseDTO createUser(UserRequestDTO requestDTO){
        User newUser = mapToEntity(requestDTO);

        String encodedPassword = passwordEncoder.encode(requestDTO.getPassword());
        newUser.setPassword(encodedPassword);
        User createdUser = userRepository.save(newUser);

        return mapToResponseDTO(createdUser);
    }

    // Update users
    public UserResponseDTO updateUser(Long id, UserRequestDTO requestDTO){
        User existingUser = getUserEntityById(id);

        existingUser.setUsername(requestDTO.getUsername());
        existingUser.setEmail(requestDTO.getEmail());

        if(requestDTO.getPassword() != null && !requestDTO.getPassword().isEmpty()){
            String encodedPassword = passwordEncoder.encode(requestDTO.getPassword());
            existingUser.setPassword(encodedPassword);
        }
        User updatedUser = userRepository.save(existingUser);

        return mapToResponseDTO(updatedUser);
    }

    // Delete user
    public void deleteUser(Long id){
        User existingUser = getUserEntityById(id);
        userRepository.delete(existingUser);
    }

    // Get user by Id
    public User getUserEntityById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Mapping Entity to DTO (Response)
    public UserResponseDTO mapToResponseDTO(User user){
        UserResponseDTO dto = new UserResponseDTO();

        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setStatus(user.isStatus());

        return dto;
    }

    // Mapping DTO to Entity
    public User mapToEntity(UserRequestDTO requestDTO){
        User user = new User();

        user.setUsername(requestDTO.getUsername());
        user.setEmail(requestDTO.getEmail());
        user.setPassword(requestDTO.getPassword());
        user.setStatus(true);

        return user;
    }
}

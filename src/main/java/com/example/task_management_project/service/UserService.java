package com.example.task_management_project.service;

import com.example.task_management_project.dto.UserRequestDTO;
import com.example.task_management_project.dto.UserResponseDTO;
import com.example.task_management_project.entity.User;
import com.example.task_management_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

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
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    // Get user by Id
    public User getUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Create new user
    public User createUser(User user){
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    // Update users
    public User updateUser(Long id, User userDetail){
        User existingUser = getUserById(id);

        existingUser.setUsername(userDetail.getUsername());
        existingUser.setEmail(userDetail.getEmail());

        if(userDetail.getPassword() != null && !userDetail.getPassword().isEmpty()){
            String encodedPassword = passwordEncoder.encode(userDetail.getPassword());
            existingUser.setPassword(encodedPassword);
        }

        return userRepository.save(existingUser);
    }

    // Delete user
    public void deleteUser(Long id){
        User existingUser = getUserById(id);
        userRepository.delete(existingUser);
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

package com.example.task_management_project.service;

import com.example.task_management_project.dto.CategoryRequestDTO;
import com.example.task_management_project.dto.CategoryResponseDTO;
import com.example.task_management_project.entity.Category;
import com.example.task_management_project.entity.User;
import com.example.task_management_project.repository.CategoryRepository;
import com.example.task_management_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, UserRepository userRepository){
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    // Get all category
    public List<CategoryResponseDTO> getAllCategories(Long userId) {
        return categoryRepository.findAllCategoriesWithTaskCountByUserId(userId);
    }

    // Create new category
    public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = mapToEntity(requestDTO);
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);

        return mapToResponseDTO(savedCategory);
    }

    // Update category
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO categoryRequestDTO, Long userId) {
        Category existingCategory = getCategoryById(id, userId);
        existingCategory.setName(categoryRequestDTO.getName());
        Category updatedCategory = categoryRepository.save(existingCategory);

        return mapToResponseDTO(updatedCategory);
    }

    // Delete category
    public void deleteCategory(Long id, Long userId) {
        Category existingCategory = getCategoryById(id, userId);
        categoryRepository.delete(existingCategory);
    }

    // Get category by Id
    public Category getCategoryById(Long id, Long userId) {
        return categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // Mapping Entity to DTO
    public CategoryResponseDTO mapToResponseDTO(Category category){
        CategoryResponseDTO responseDTO = new CategoryResponseDTO();

        responseDTO.setId(category.getId());
        responseDTO.setName(category.getName());
        responseDTO.setCount(0L);

        return responseDTO;
    }

    // Mapping DTO to Entity
    public Category mapToEntity(CategoryRequestDTO requestDTO){
        Category category = new Category();
        category.setName(requestDTO.getName());

        return category;
    }
}

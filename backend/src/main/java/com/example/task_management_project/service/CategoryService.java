package com.example.task_management_project.service;

import com.example.task_management_project.dto.CategoryRequestDTO;
import com.example.task_management_project.dto.CategoryResponseDTO;
import com.example.task_management_project.entity.Category;
import com.example.task_management_project.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository){
        this.categoryRepository = categoryRepository;
    }

    // Get all category
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Get category by Id
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // Create new category
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // Update category
    public Category updateCategory(Long id, Category categoryDetails) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(categoryDetails.getName());

        return categoryRepository.save(existingCategory);
    }

    // Delete category
    public void deleteCategory(Long id) {
        Category existingCategory = getCategoryById(id);
        categoryRepository.delete(existingCategory);
    }

    // Mapping Entity to DTO
    public CategoryResponseDTO mapToResponseDTO(Category category){
        CategoryResponseDTO responseDTO = new CategoryResponseDTO();

        responseDTO.setId(responseDTO.getId());
        responseDTO.setName(responseDTO.getName());

        return responseDTO;
    }

    // Mapping DTO to Entity
    public Category mapToEntity(CategoryRequestDTO requestDTO){
        Category category = new Category();
        category.setName(requestDTO.getName());

        return category;
    }
}

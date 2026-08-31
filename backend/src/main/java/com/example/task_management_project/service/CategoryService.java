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
    public List<CategoryResponseDTO> getAllCategories() {
        return categoryRepository.findAllCategoriesWithTaskCount();
    }

    // Create new category
    public CategoryResponseDTO createCategory(CategoryRequestDTO requestDTO) {
        Category category = mapToEntity(requestDTO);
        Category savedCategory = categoryRepository.save(category);

        return mapToResponseDTO(savedCategory);
    }

    // Update category
    public CategoryResponseDTO updateCategory(Long id, CategoryRequestDTO categoryRequestDTO) {
        Category existingCategory = getCategoryById(id);
        existingCategory.setName(categoryRequestDTO.getName());
        Category updatedCategory = categoryRepository.save(existingCategory);

        return mapToResponseDTO(updatedCategory);
    }

    // Delete category
    public void deleteCategory(Long id) {
        Category existingCategory = getCategoryById(id);
        categoryRepository.delete(existingCategory);
    }

    // Get category by Id
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    // Mapping Entity to DTO
    public CategoryResponseDTO mapToResponseDTO(Category category){
        CategoryResponseDTO responseDTO = new CategoryResponseDTO();

        responseDTO.setId(responseDTO.getId());
        responseDTO.setName(responseDTO.getName());
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

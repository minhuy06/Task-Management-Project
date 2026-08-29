package com.example.task_management_project.controller;

import com.example.task_management_project.dto.CategoryRequestDTO;
import com.example.task_management_project.dto.CategoryResponseDTO;
import com.example.task_management_project.entity.Category;
import com.example.task_management_project.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    // Get all category
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategory(){
        List<CategoryResponseDTO> responseDTOS = categoryService.getAllCategories()
                .stream()
                .map(categoryService::mapToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    // Get category by id
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id){
        Category category = new Category();
        return ResponseEntity.ok(categoryService.mapToResponseDTO(category));
    }

    // Create new category
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@RequestBody CategoryRequestDTO requestDTO){
        Category category = categoryService.mapToEntity(requestDTO);
        Category savedCategory = categoryService.createCategory(category);

        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.mapToResponseDTO(savedCategory));
    }

    // Update category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryRequestDTO requestDTO){
        Category categoryDetail = categoryService.mapToEntity(requestDTO);
        Category updatedCategory = categoryService.updateCategory(id, categoryDetail);

        return ResponseEntity.ok(categoryService.mapToResponseDTO(updatedCategory));
    }

    // Delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}

package com.example.task_management_project.controller;

import com.example.task_management_project.dto.CategoryRequestDTO;
import com.example.task_management_project.dto.CategoryResponseDTO;
import com.example.task_management_project.security.CustomUserDetails;
import com.example.task_management_project.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService){
        this.categoryService = categoryService;
    }

    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    // Get all category
    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAllCategory(){
        Long userId = getCurrentUserId();
        List<CategoryResponseDTO> responseDTOS = categoryService.getAllCategories(userId);
        return ResponseEntity.ok(responseDTOS);
    }

    // Get category by id
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getCategoryById(@PathVariable Long id){
        Long userId = getCurrentUserId();
        CategoryResponseDTO responseDTO = categoryService.mapToResponseDTO(categoryService.getCategoryById(id, userId));
        return ResponseEntity.ok(responseDTO);
    }

    // Create new category
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> createCategory(@RequestBody CategoryRequestDTO requestDTO){
        Long userId = getCurrentUserId();
        CategoryResponseDTO createdCategory = categoryService.createCategory(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    // Update category
    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryRequestDTO requestDTO){
        Long userId = getCurrentUserId();
        CategoryResponseDTO updatedCategory = categoryService.updateCategory(id, requestDTO, userId);
        return ResponseEntity.ok(updatedCategory);
    }

    // Delete category
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id){
        Long userId = getCurrentUserId();
        categoryService.deleteCategory(id, userId);
        return ResponseEntity.noContent().build();
    }
}

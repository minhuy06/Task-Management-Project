package com.example.task_management_project.repository;

import com.example.task_management_project.dto.CategoryResponseDTO;
import com.example.task_management_project.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("select new com.example.task_management_project.dto.CategoryResponseDTO(c.id, c.name, COUNT(t.id)) " +
            "from Category c LEFT JOIN Task t on t.category.id = c.id " +
            "group by c.id, c.name")
    List<CategoryResponseDTO> findAllCategoriesWithTaskCount();
}

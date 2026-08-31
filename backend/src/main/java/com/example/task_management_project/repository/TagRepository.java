package com.example.task_management_project.repository;

import com.example.task_management_project.dto.TagResponseDTO;
import com.example.task_management_project.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {

    @Query("select new com.example.task_management_project.dto.TagResponseDTO(tg.id, tg.name, tg.color, COUNT(t.id)) "+
    "from Tag tg LEFT JOIN tg.tasks t " +
    "GROUP BY tg.id, tg.name, tg.color")
    List<TagResponseDTO> findAllTagsWithTaskCount();
}

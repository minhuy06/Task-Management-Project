package com.example.task_management_project.controller;

import com.example.task_management_project.dto.TagRequestDTO;
import com.example.task_management_project.dto.TagResponseDTO;
import com.example.task_management_project.entity.Tag;
import com.example.task_management_project.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService){
        this.tagService = tagService;
    }

    // Get all tag
    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> getAllTag(){
        List<TagResponseDTO> responseDTOS = tagService.getAllTags();
        return ResponseEntity.ok(responseDTOS);
    }

    // Get tag by id
    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> getTagById(@PathVariable Long id){
        TagResponseDTO responseDTO = tagService.mapToResponseDTO(tagService.getTagById(id));
        return ResponseEntity.ok(responseDTO);
    }

    // Create new tag
    @PostMapping
    public ResponseEntity<TagResponseDTO> createTag(@RequestBody TagRequestDTO requestDTO){
        TagResponseDTO responseDTO = tagService.createTag(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    // Update tag
    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDTO> updateTag(@PathVariable Long id, @RequestBody TagRequestDTO requestDTO){
        TagResponseDTO updatedTag = tagService.updateTag(id, requestDTO);
        return ResponseEntity.ok(updatedTag);
    }

    // Delete tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id){
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}

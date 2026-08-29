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
        List<TagResponseDTO> responseDTOS = tagService.getAllTags()
                .stream()
                .map(tagService::mapToResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    // Get tag by id
    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> getTagById(@PathVariable Long id){
        Tag tag = tagService.getTagById(id);
        return ResponseEntity.ok(tagService.mapToResponseDTO(tag));
    }

    // Create new tag
    @PostMapping
    public ResponseEntity<TagResponseDTO> createTag(@RequestBody TagRequestDTO requestDTO){
        Tag tag = tagService.mapToEntity(requestDTO);
        Tag savedTag = tagService.createTag(tag);

        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.mapToResponseDTO(savedTag));
    }

    // Update tag
    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDTO> updateTag(@PathVariable Long id, @RequestBody TagRequestDTO requestDTO){
        Tag tagDetail = tagService.mapToEntity(requestDTO);
        Tag savedTag = tagService.updateTag(id, tagDetail);

        return ResponseEntity.ok(tagService.mapToResponseDTO(savedTag));
    }

    // Delete tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id){
        tagService.deleteTag(id);
        return ResponseEntity.noContent().build();
    }
}

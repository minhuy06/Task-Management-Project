package com.example.task_management_project.controller;

import com.example.task_management_project.dto.TagRequestDTO;
import com.example.task_management_project.dto.TagResponseDTO;
import com.example.task_management_project.security.CustomUserDetails;
import com.example.task_management_project.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService){
        this.tagService = tagService;
    }

    private Long getCurrentUserId(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return userDetails.getId();
    }

    // Get all tag
    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> getAllTag(){
        Long userId = getCurrentUserId();
        List<TagResponseDTO> responseDTOS = tagService.getAllTags(userId);
        return ResponseEntity.ok(responseDTOS);
    }

    // Create new tag
    @PostMapping
    public ResponseEntity<TagResponseDTO> createTag(@RequestBody TagRequestDTO requestDTO){
        Long userId = getCurrentUserId();

        TagResponseDTO responseDTO = tagService.createTag(requestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    // Update tag
    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDTO> updateTag(@PathVariable Long id, @RequestBody TagRequestDTO requestDTO){
        Long userId = getCurrentUserId();

        TagResponseDTO updatedTag = tagService.updateTag(id, userId, requestDTO);
        return ResponseEntity.ok(updatedTag);
    }

    // Delete tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id){
        Long userId = getCurrentUserId();

        tagService.deleteTag(id, userId);
        return ResponseEntity.noContent().build();
    }
}

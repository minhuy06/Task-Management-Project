package com.example.task_management_project.service;

import com.example.task_management_project.dto.TagRequestDTO;
import com.example.task_management_project.dto.TagResponseDTO;
import com.example.task_management_project.entity.Tag;
import com.example.task_management_project.entity.Task;
import com.example.task_management_project.entity.User;
import com.example.task_management_project.repository.TagRepository;
import com.example.task_management_project.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagService {

    private final TagRepository tagRepository;
    private final UserRepository userRepository;

    @Autowired
    public TagService(TagRepository tagRepository, UserRepository userRepository) {
        this.tagRepository = tagRepository;
        this.userRepository = userRepository;
    }

    private Tag getTagEntityByIdAndUserId(Long id,Long userId){
        return tagRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Tag not found or access denied"));
    }

    // Get all tag
    public List<TagResponseDTO> getAllTags(Long userId) {
        return tagRepository.findAllTagsWithTaskCount(userId);
    }

    // Create new tag
    public TagResponseDTO createTag(TagRequestDTO requestDTO, Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tag newTag = mapToEntity(requestDTO);
        newTag.setUser(currentUser);
        Tag createdTag = tagRepository.save(newTag);

        return mapToResponseDTO(createdTag);
    }

    // Update tag
    public TagResponseDTO updateTag(Long id, Long userId, TagRequestDTO requestDTO) {
        Tag existingTag = getTagEntityByIdAndUserId(id, userId);
        existingTag.setName(requestDTO.getName());
        existingTag.setColor(requestDTO.getColor());

        Tag updatedTag = tagRepository.save(existingTag);
        return mapToResponseDTO(updatedTag);
    }

    // Delete tag
    public void deleteTag(Long id, Long userId) {
        Tag existingTag = getTagEntityByIdAndUserId(id, userId);
        tagRepository.delete(existingTag);
    }

    // Mapping Entity to DTO
    public TagResponseDTO mapToResponseDTO(Tag tag){
        TagResponseDTO responseDTO = new TagResponseDTO();

        responseDTO.setId(tag.getId());
        responseDTO.setName(tag.getName());
        responseDTO.setColor(tag.getColor());
        responseDTO.setCount(0L);

        return responseDTO;
    }

    // Mapping DTO to Entity
    public Tag mapToEntity(TagRequestDTO requestDTO){
        Tag tag = new Tag();
        tag.setName(requestDTO.getName());
        tag.setColor(requestDTO.getColor());

        return tag;
    }
}
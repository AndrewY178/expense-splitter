package com.expensesplitter.service;

import com.expensesplitter.dto.CreateGroupRequest;
import com.expensesplitter.dto.GroupDTO;
import com.expensesplitter.model.Group;
import com.expensesplitter.model.User;
import com.expensesplitter.repository.GroupRepository;
import com.expensesplitter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GroupService {

    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional
    public GroupDTO createGroup(CreateGroupRequest request, User creator) {
        Group group = new Group();
        group.setName(request.getName());
        group.setCreatedBy(creator);

        Set<User> members = new HashSet<>();
        members.add(creator); // Creator is automatically a member

        group.setMembers(members);
        group = groupRepository.save(group);

        return toDTO(group);
    }

    public GroupDTO getGroupById(Long id) {
        Group group = groupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + id));
        return toDTO(group);
    }

    public List<GroupDTO> getUserGroups(User user) {
        List<Group> createdGroups = groupRepository.findByCreatedBy(user);
        List<Group> memberGroups = groupRepository.findByMembersContaining(user);

        Set<Group> allGroups = new HashSet<>();
        allGroups.addAll(createdGroups);
        allGroups.addAll(memberGroups);

        return allGroups.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GroupDTO addMember(Long groupId, Long userId, User requester) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        if (!group.getCreatedBy().getId().equals(requester.getId())) {
            throw new IllegalStateException("Only group creator can add members");
        }

        User member = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        group.getMembers().add(member);
        group = groupRepository.save(group);

        return toDTO(group);
    }

    @Transactional
    public GroupDTO removeMember(Long groupId, Long userId, User requester) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        if (!group.getCreatedBy().getId().equals(requester.getId())) {
            throw new IllegalStateException("Only group creator can remove members");
        }

        User member = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (group.getCreatedBy().getId().equals(userId)) {
            throw new IllegalStateException("Cannot remove group creator");
        }

        group.getMembers().remove(member);
        group = groupRepository.save(group);

        return toDTO(group);
    }

    private GroupDTO toDTO(Group group) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setCreatedById(group.getCreatedBy().getId());
        dto.setCreatedByName(group.getCreatedBy().getName());
        dto.setMemberIds(group.getMembers().stream()
                .map(User::getId)
                .collect(Collectors.toSet()));
        dto.setCreatedAt(group.getCreatedAt());
        dto.setUpdatedAt(group.getUpdatedAt());
        return dto;
    }

    public void deleteGroup(Long groupId) {
        if (!groupRepository.existsById(groupId)) {
            throw new IllegalArgumentException("Group not found");
        }
        groupRepository.deleteById(groupId);
    }
}


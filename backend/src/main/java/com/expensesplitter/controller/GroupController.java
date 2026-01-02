package com.expensesplitter.controller;

import com.expensesplitter.dto.CreateGroupRequest;
import com.expensesplitter.dto.GroupDTO;
import com.expensesplitter.model.User;
import com.expensesplitter.service.GroupService;
import com.expensesplitter.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor


public class GroupController {

    private final GroupService groupService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@Valid @RequestBody CreateGroupRequest request) {
        User currentUser = userService.getCurrentUser();
        GroupDTO group = groupService.createGroup(request, currentUser);
        return ResponseEntity.ok(group);
    }

    @GetMapping
    public ResponseEntity<List<GroupDTO>> getUserGroups() {
        User currentUser = userService.getCurrentUser();
        List<GroupDTO> groups = groupService.getUserGroups(currentUser);
        return ResponseEntity.ok(groups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Long id) {
        GroupDTO group = groupService.getGroupById(id);
        return ResponseEntity.ok(group);
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<GroupDTO> addMember(
            @PathVariable Long id,
            @RequestBody Long userId) {
        User currentUser = userService.getCurrentUser();
        GroupDTO group = groupService.addMember(id, userId, currentUser);
        return ResponseEntity.ok(group);
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<GroupDTO> removeMember(
            @PathVariable Long id,
            @PathVariable Long userId) {
        User currentUser = userService.getCurrentUser();
        GroupDTO group = groupService.removeMember(id, userId, currentUser);
        return ResponseEntity.ok(group);
    }
}


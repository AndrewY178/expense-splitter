package com.expensesplitter.controller;

import com.expensesplitter.dto.SettlementDTO;
import com.expensesplitter.model.User;
import com.expensesplitter.service.SettlementService;
import com.expensesplitter.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;
    private final UserService userService;

    @GetMapping("/{groupId}/settlements")
    public ResponseEntity<List<SettlementDTO>> getSettlements(@PathVariable Long groupId) {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(settlementService.calculateSettlements(groupId, currentUser));
    }
}



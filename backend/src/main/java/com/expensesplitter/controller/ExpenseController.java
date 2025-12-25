package com.expensesplitter.controller;

import com.expensesplitter.dto.CreateExpenseRequest;
import com.expensesplitter.dto.ExpenseDTO;
import com.expensesplitter.dto.ExpenseSplitDTO;
import com.expensesplitter.model.User;
import com.expensesplitter.service.ExpenseService;
import com.expensesplitter.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private final UserService userService;

    @PostMapping("/groups/{groupId}/expenses")
    public ResponseEntity<ExpenseDTO> createExpense(
            @PathVariable Long groupId,
            @Valid @RequestBody CreateExpenseRequest request) {
        request.setGroupId(groupId); // Ensure groupId matches path variable
        User currentUser = userService.getCurrentUser();
        ExpenseDTO expense = expenseService.createExpense(request, currentUser);
        return ResponseEntity.ok(expense);
    }

    @GetMapping("/groups/{groupId}/expenses")
    public ResponseEntity<List<ExpenseDTO>> getExpensesByGroup(@PathVariable Long groupId) {
        List<ExpenseDTO> expenses = expenseService.getExpensesByGroup(groupId);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/expenses/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        ExpenseDTO expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }

    @PatchMapping("/expenses/{id}/splits/{splitId}/pay")
    public ResponseEntity<ExpenseSplitDTO> markSplitAsPaid(
            @PathVariable Long id,
            @PathVariable Long splitId) {
        User currentUser = userService.getCurrentUser();
        ExpenseSplitDTO split = expenseService.markSplitAsPaid(splitId, currentUser);
        return ResponseEntity.ok(split);
    }
}


package com.expensesplitter.service;

import com.expensesplitter.dto.CreateExpenseRequest;
import com.expensesplitter.dto.ExpenseDTO;
import com.expensesplitter.dto.ExpenseSplitDTO;
import com.expensesplitter.model.Expense;
import com.expensesplitter.model.ExpenseSplit;
import com.expensesplitter.model.Group;
import com.expensesplitter.model.User;
import com.expensesplitter.repository.ExpenseRepository;
import com.expensesplitter.repository.ExpenseSplitRepository;
import com.expensesplitter.repository.GroupRepository;
import com.expensesplitter.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseSplitRepository expenseSplitRepository;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;

    @Transactional
    public ExpenseDTO createExpense(CreateExpenseRequest request, User paidBy) {
        Group group = groupRepository.findById(request.getGroupId())
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + request.getGroupId()));

        if (!group.getMembers().contains(paidBy)) {
            throw new IllegalStateException("User is not a member of this group");
        }

        // Validate splits
        BigDecimal totalSplits = request.getSplits().values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalSplits.compareTo(request.getAmount()) != 0) {
            throw new IllegalArgumentException("Total splits must equal expense amount");
        }

        // Validate all split users are group members
        for (Long userId : request.getSplits().keySet()) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            if (!group.getMembers().contains(user)) {
                throw new IllegalStateException("User " + userId + " is not a member of this group");
            }
        }

        Expense expense = new Expense();
        expense.setDescription(request.getDescription());
        expense.setAmount(request.getAmount());
        expense.setGroup(group);
        expense.setPaidBy(paidBy);
        expense.setCreatedAt(Instant.now());
        expense = expenseRepository.save(expense);

        // Create splits
        List<ExpenseSplit> splits = new ArrayList<>();
        for (Map.Entry<Long, BigDecimal> entry : request.getSplits().entrySet()) {
            User user = userRepository.findById(entry.getKey())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + entry.getKey()));

            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(entry.getValue());
            split.setPaid(false);
            splits.add(expenseSplitRepository.save(split));
        }

        expense.setSplits(splits);
        return toDTO(expense);
    }

    public List<ExpenseDTO> getExpensesByGroup(Long groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        List<Expense> expenses = expenseRepository.findByGroup(group);
        return expenses.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ExpenseDTO getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found with id: " + id));
        return toDTO(expense);
    }

    @Transactional
    public ExpenseSplitDTO markSplitAsPaid(Long splitId, User user) {
        ExpenseSplit split = expenseSplitRepository.findById(splitId)
                .orElseThrow(() -> new IllegalArgumentException("Expense split not found with id: " + splitId));

        if (!split.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("User can only mark their own splits as paid");
        }

        split.setPaid(true);
        split = expenseSplitRepository.save(split);

        ExpenseSplitDTO dto = new ExpenseSplitDTO();
        dto.setId(split.getId());
        dto.setUserId(split.getUser().getId());
        dto.setUserName(split.getUser().getName());
        dto.setAmount(split.getAmount());
        dto.setPaid(split.isPaid());
        return dto;
    }

    private ExpenseDTO toDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setId(expense.getId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setGroupId(expense.getGroup().getId());
        dto.setPaidById(expense.getPaidBy().getId());
        dto.setPaidByName(expense.getPaidBy().getName());
        dto.setCreatedAt(expense.getCreatedAt());

        List<ExpenseSplitDTO> splitDTOs = expense.getSplits().stream()
                .map(split -> {
                    ExpenseSplitDTO splitDTO = new ExpenseSplitDTO();
                    splitDTO.setId(split.getId());
                    splitDTO.setUserId(split.getUser().getId());
                    splitDTO.setUserName(split.getUser().getName());
                    splitDTO.setAmount(split.getAmount());
                    splitDTO.setPaid(split.isPaid());
                    return splitDTO;
                })
                .collect(Collectors.toList());
        dto.setSplits(splitDTOs);

        return dto;
    }
}


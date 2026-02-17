package com.expensesplitter.service;

import com.expensesplitter.dto.SettlementDTO;
import com.expensesplitter.model.Expense;
import com.expensesplitter.model.ExpenseSplit;
import com.expensesplitter.model.Group;
import com.expensesplitter.model.User;
import com.expensesplitter.repository.ExpenseRepository;
import com.expensesplitter.repository.GroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SettlementService {

    private final GroupRepository groupRepository;
    private final ExpenseRepository expenseRepository;

    @Transactional(readOnly = true)
    public List<SettlementDTO> calculateSettlements(Long groupId, User requester) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with id: " + groupId));

        if (!group.getMembers().contains(requester)) {
            throw new IllegalStateException("User is not a member of this group");
        }

        Map<Long, User> userById = new HashMap<>();
        for (User u : group.getMembers()) {
            userById.put(u.getId(), u);
        }

        // balance > 0 means user should receive money, < 0 means user owes money
        Map<Long, BigDecimal> balance = new HashMap<>();
        for (Long userId : userById.keySet()) {
            balance.put(userId, BigDecimal.ZERO);
        }

        // Compute balances from expenses/splits. We only count unpaid splits.
        // If an expense is paid by A and split says B owes $x, then:
        //  - A should receive +x
        //  - B owes -x
        for (Expense expense : expenseRepository.findByGroup(group)) {
            User paidBy = expense.getPaidBy();
            if (paidBy == null) continue;

            for (ExpenseSplit split : expense.getSplits()) {
                if (split.isPaid()) continue;
                if (split.getUser() == null) continue;
                if (paidBy.getId().equals(split.getUser().getId())) continue;

                BigDecimal amt = split.getAmount() == null ? BigDecimal.ZERO : split.getAmount();
                if (amt.compareTo(BigDecimal.ZERO) <= 0) continue;

                balance.put(paidBy.getId(), balance.getOrDefault(paidBy.getId(), BigDecimal.ZERO).add(amt));
                balance.put(split.getUser().getId(), balance.getOrDefault(split.getUser().getId(), BigDecimal.ZERO).subtract(amt));
            }
        }

        // Greedy settlement generation
        List<Map.Entry<Long, BigDecimal>> creditors = balance.entrySet().stream()
                .filter(e -> e.getValue().compareTo(BigDecimal.ZERO) > 0)
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .toList();

        List<Map.Entry<Long, BigDecimal>> debtors = balance.entrySet().stream()
                .filter(e -> e.getValue().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Comparator.comparing(Map.Entry::getValue)) // most negative first
                .toList();

        int i = 0;
        int j = 0;
        List<SettlementDTO> settlements = new ArrayList<>();

        // Make mutable copies
        Map<Long, BigDecimal> bal = new HashMap<>(balance);

        while (i < debtors.size() && j < creditors.size()) {
            Long debtorId = debtors.get(i).getKey();
            Long creditorId = creditors.get(j).getKey();

            BigDecimal owes = bal.get(debtorId).abs();
            BigDecimal gets = bal.get(creditorId);
            BigDecimal pay = owes.min(gets).setScale(2, RoundingMode.HALF_UP);

            if (pay.compareTo(BigDecimal.ZERO) > 0) {
                User from = userById.get(debtorId);
                User to = userById.get(creditorId);
                settlements.add(new SettlementDTO(
                        from.getId(), from.getName(),
                        to.getId(), to.getName(),
                        pay
                ));

                bal.put(debtorId, bal.get(debtorId).add(pay));
                bal.put(creditorId, bal.get(creditorId).subtract(pay));
            }

            if (bal.get(debtorId).compareTo(BigDecimal.ZERO) == 0) i++;
            if (bal.get(creditorId).compareTo(BigDecimal.ZERO) == 0) j++;
        }

        return settlements;
    }
}



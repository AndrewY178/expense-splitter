package com.expensesplitter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {
    private Long id;
    private String description;
    private BigDecimal amount;
    private Long groupId;
    private Long paidById;
    private String paidByName;
    private Instant createdAt;
    private List<ExpenseSplitDTO> splits;
}


package com.expensesplitter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseItemDTO {
    private Long id;
    private String description;
    private BigDecimal amount;
    private Long assignedToId;
    private String assignedToName;
}



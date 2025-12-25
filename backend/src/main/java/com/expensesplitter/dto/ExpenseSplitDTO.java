package com.expensesplitter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSplitDTO {
    private Long id;
    private Long userId;
    private String userName;
    private BigDecimal amount;
    private boolean isPaid;
}


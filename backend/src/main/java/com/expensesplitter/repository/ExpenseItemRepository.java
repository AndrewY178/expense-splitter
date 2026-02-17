package com.expensesplitter.repository;

import com.expensesplitter.model.Expense;
import com.expensesplitter.model.ExpenseItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseItemRepository extends JpaRepository<ExpenseItem, Long> {
    List<ExpenseItem> findByExpense(Expense expense);
}



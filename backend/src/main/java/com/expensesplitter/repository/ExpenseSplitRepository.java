package com.expensesplitter.repository;

import com.expensesplitter.model.Expense;
import com.expensesplitter.model.ExpenseSplit;
import com.expensesplitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpense(Expense expense);
    List<ExpenseSplit> findByUser(User user);
    List<ExpenseSplit> findByUserAndIsPaidFalse(User user);
}


package com.expensesplitter.repository;

import com.expensesplitter.model.Expense;
import com.expensesplitter.model.Group;
import com.expensesplitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByGroup(Group group);
    List<Expense> findByPaidBy(User user);
}


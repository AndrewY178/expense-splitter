package com.expensesplitter.repository;

import com.expensesplitter.model.Group;
import com.expensesplitter.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByCreatedBy(User user);
    List<Group> findByMembersContaining(User user);
}


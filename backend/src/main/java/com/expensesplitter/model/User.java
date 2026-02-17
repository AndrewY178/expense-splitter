package com.expensesplitter.model;

import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Email(message = "Invalid email address")
    @NotBlank(message = "Email is required")
    @Column(nullable = false, unique = true)
    private String email;

    // Password is required and must be at least 8 characters long
    @NotBlank(message = "Password is required")
    // Password must be at least 8 characters long
    @Size(min = 8, message = "Password must be at least 8 characters long")
    // Password is not nullable
    @Column(nullable = false)
    // Password is a string
    private String password;

    @NotBlank(message = "Name is required")
    @Column(nullable = false)
    private String name;

    //Create/Update timestamps
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;


    //Relationships
    @Builder.Default // <--- ADD THIS
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    private Set<Group> createdGroups = new HashSet<>();
    
    @Builder.Default // <--- ADD THIS
    @OneToMany(mappedBy = "paidBy", cascade = CascadeType.ALL)
    private Set<Expense> paidExpenses = new HashSet<>();
    
    @Builder.Default // <--- ADD THIS
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private Set<ExpenseSplit> expenseSplits = new HashSet<>();

    //overrides
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if(!(o instanceof User)) {
            return false;
        }
        User other = (User) o;
        return id != null && id.equals(other.id);
    }

    @Override 
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString(){
        return "User{" + 
        "id=" + id +
        ", email='" + email + '\'' +
        ", name='" + name + '\'' +
        '}';
    }
}




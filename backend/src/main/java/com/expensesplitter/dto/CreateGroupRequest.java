package com.expensesplitter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateGroupRequest {
    @NotBlank(message = "Group name is required")
    private String name;

    private String description;

    @NotNull(message = "Member IDs are required")
    private List<Long> memberIds;
}

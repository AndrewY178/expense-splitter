package com.expensesplitter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateGroupRequest {
    @NotBlank(message = "Group name is required")
    private String name;

    private String description;

    @NotNull(message = "Member IDs are required")
    private List<Long> memberIds;
}


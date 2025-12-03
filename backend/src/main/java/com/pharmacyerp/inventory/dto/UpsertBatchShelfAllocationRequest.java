package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotNull;

public record UpsertBatchShelfAllocationRequest(
        @NotNull Integer shelfId,
        @NotNull Integer quantity,
        Integer threshold
) {
}

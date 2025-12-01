package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotNull;

public record UpsertStockLevelRequest(
        @NotNull Integer productId,
        @NotNull Integer locationId,
        String stockType,
        @NotNull Integer onHandQuantity,
        String dispatchMethod
) {
}

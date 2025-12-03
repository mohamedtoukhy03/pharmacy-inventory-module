package com.pharmacyerp.inventory.dto;

import jakarta.validation.constraints.NotNull;

public record UpsertShelfRequest(
        @NotNull Integer locationId,
        Integer onHandQty,
        String dispatchMethod
) {
}

package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.StockType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpsertBatchRequest(
        @NotNull Integer productId,
        @NotNull Integer locationId,
        StockType stockType,
        @NotNull Integer quantity,
        String batchNumber,
        Integer cost,
        Integer supplierId,
        LocalDate manufacturingDate,
        LocalDate expiryDate,
        LocalDate receivingDate,
        LocalDate alertDate,
        LocalDate clearanceDate,
        Integer parentBatchId
) {
}

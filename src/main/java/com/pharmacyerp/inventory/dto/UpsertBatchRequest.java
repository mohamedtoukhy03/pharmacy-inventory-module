package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.entity.Batch;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpsertBatchRequest(
        @NotNull Integer productId,
        @NotNull Integer locationId,
        Batch.StockType stockType,
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

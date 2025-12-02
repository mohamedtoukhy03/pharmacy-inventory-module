package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.ActiveStatus;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpsertSupplierRequest(
        @Size(max = 30) String supplierName,
        @Size(max = 30) String supplierPhone,
        @Size(max = 30) String supplierEmail,
        @Size(max = 30) String country,
        BigDecimal rating,
        @Size(max = 30) String currency,
        ActiveStatus activeStatus
) {
}

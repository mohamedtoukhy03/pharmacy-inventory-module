package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.ActiveStatus;

import java.math.BigDecimal;

public record SupplierDto(
        Integer id,
        String supplierName,
        String supplierPhone,
        String supplierEmail,
        String country,
        BigDecimal rating,
        String currency,
        ActiveStatus activeStatus
) {
}

package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.entity.Batch;
import com.pharmacyerp.inventory.enums.StockType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class BatchSpecifications {

    private BatchSpecifications() {
    }

    public static Specification<Batch> hasProductId(Integer productId) {
        return (root, query, cb) -> {
            if (productId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("product").get("id"), productId);
        };
    }

    public static Specification<Batch> hasLocationId(Integer locationId) {
        return (root, query, cb) -> {
            if (locationId == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("location").get("id"), locationId);
        };
    }

    public static Specification<Batch> hasStockType(StockType stockType) {
        return (root, query, cb) -> {
            if (stockType == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("stockType"), stockType);
        };
    }

    public static Specification<Batch> batchNumberContains(String batchNumber) {
        return (root, query, cb) -> {
            if (batchNumber == null || batchNumber.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + batchNumber.toLowerCase() + "%";
            return cb.like(cb.lower(root.get("batchNumber")), like);
        };
    }

    public static Specification<Batch> expiryBefore(LocalDate date) {
        return (root, query, cb) -> {
            if (date == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("expiryDate"), date);
        };
    }
}

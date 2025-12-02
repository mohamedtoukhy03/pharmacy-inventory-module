package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.entity.Supplier;
import com.pharmacyerp.inventory.enums.ActiveStatus;
import org.springframework.data.jpa.domain.Specification;

public final class SupplierSpecifications {

    private SupplierSpecifications() {
    }

    public static Specification<Supplier> hasCountry(String country) {
        return (root, query, cb) -> {
            if (country == null || country.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(root.get("country"), country);
        };
    }

    public static Specification<Supplier> hasActiveStatus(ActiveStatus activeStatus) {
        return (root, query, cb) -> {
            if (activeStatus == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("activeStatus"), activeStatus);
        };
    }
}

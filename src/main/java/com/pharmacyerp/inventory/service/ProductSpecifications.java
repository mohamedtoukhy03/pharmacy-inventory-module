package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.entity.Product;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

public final class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> nameOrBarcodeOrSkuContains(String value) {
        return (root, query, cb) -> {
            if (value == null || value.isBlank()) {
                return cb.conjunction();
            }
            String like = "%" + value.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), like),
                    cb.like(cb.lower(root.get("barcode")), like),
                    cb.like(cb.lower(root.get("sku")), like)
            );
        };
    }

    public static Specification<Product> hasIsDrug(Boolean isDrug) {
        return (root, query, cb) -> {
            if (isDrug == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("isDrug"), isDrug);
        };
    }

    public static Specification<Product> hasControlledSubstance(Boolean controlled) {
        return (root, query, cb) -> {
            if (controlled == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("controlledSubstance"), controlled);
        };
    }

    public static Specification<Product> inCategory(Integer categoryId) {
        return (root, query, cb) -> {
            if (categoryId == null) {
                return cb.conjunction();
            }
            query.distinct(true);
            var join = root.join("categories", JoinType.LEFT);
            return cb.equal(join.get("id"), categoryId);
        };
    }
}



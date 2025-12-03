package com.pharmacyerp.inventory.service;

import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.enums.LocationStatus;
import com.pharmacyerp.inventory.enums.LocationType;
import org.springframework.data.jpa.domain.Specification;

public final class LocationSpecifications {

    private LocationSpecifications() {
    }

    public static Specification<Location> hasType(LocationType type) {
        return (root, query, cb) -> {
            if (type == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("locationType"), type);
        };
    }

    public static Specification<Location> hasStatus(LocationStatus status) {
        return (root, query, cb) -> {
            if (status == null) {
                return cb.conjunction();
            }
            return cb.equal(root.get("status"), status);
        };
    }
}

package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Location;
import com.pharmacyerp.inventory.enums.LocationStatus;
import com.pharmacyerp.inventory.enums.LocationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer>, JpaSpecificationExecutor<Location> {

    List<Location> findByLocationType(LocationType type);

    List<Location> findByStatus(LocationStatus status);

    List<Location> findByLocationTypeAndStatus(LocationType type, LocationStatus status);
}

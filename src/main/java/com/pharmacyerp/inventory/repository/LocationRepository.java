package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Integer>, JpaSpecificationExecutor<Location> {

    List<Location> findByLocationType(Location.LocationType type);

    List<Location> findByStatus(Location.LocationStatus status);

    List<Location> findByLocationTypeAndStatus(Location.LocationType type, Location.LocationStatus status);
}

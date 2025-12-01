package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.StockLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockLevelRepository extends JpaRepository<StockLevel, Integer> {

    List<StockLevel> findByProductId(Integer productId);

    List<StockLevel> findByLocationId(Integer locationId);

    Optional<StockLevel> findByProductIdAndLocationId(Integer productId, Integer locationId);
}

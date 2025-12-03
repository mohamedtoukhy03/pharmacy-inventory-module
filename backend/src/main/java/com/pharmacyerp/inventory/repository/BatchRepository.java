package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Batch;
import com.pharmacyerp.inventory.enums.StockType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Integer>, JpaSpecificationExecutor<Batch> {

    List<Batch> findByProductId(Integer productId);

    long countByProductId(Integer productId);

    List<Batch> findByLocationId(Integer locationId);

    List<Batch> findByStockType(StockType stockType);

    List<Batch> findByBatchNumberContainingIgnoreCase(String batchNumber);

    List<Batch> findByExpiryDateBefore(LocalDate date);
}

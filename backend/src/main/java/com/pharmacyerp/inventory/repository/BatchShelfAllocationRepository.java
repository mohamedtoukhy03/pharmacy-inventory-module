package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.BatchShelfAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BatchShelfAllocationRepository extends JpaRepository<BatchShelfAllocation, Integer> {

    List<BatchShelfAllocation> findByBatchId(Integer batchId);

    List<BatchShelfAllocation> findByShelfId(Integer shelfId);
}

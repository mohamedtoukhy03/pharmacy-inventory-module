package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Shelf;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShelfRepository extends JpaRepository<Shelf, Integer> {

    List<Shelf> findByLocationId(Integer locationId);
}

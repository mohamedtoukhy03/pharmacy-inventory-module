package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByNameContainingIgnoreCase(String name);
}




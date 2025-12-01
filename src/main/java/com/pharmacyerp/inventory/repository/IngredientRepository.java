package com.pharmacyerp.inventory.repository;

import com.pharmacyerp.inventory.entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Integer> {

    List<Ingredient> findByNameContainingIgnoreCase(String name);

    List<Ingredient> findByNameContainingIgnoreCaseAndActive(String name, Boolean active);
}




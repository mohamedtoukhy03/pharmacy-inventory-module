package com.pharmacyerp.inventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "\"Products\"")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer id;

    @Column(name = "name", length = 40, nullable = false)
    private String name;

    @Column(name = "barcode", length = 130)
    private String barcode;

    @Column(name = "SKU", length = 64)
    private String sku;

    @Column(name = "scientific_name", length = 40)
    private String scientificName;

    @Column(name = "description")
    private String description;

    @Column(name = "cost")
    private Integer cost;

    @Column(name = "selling_price")
    private Integer sellingPrice;

    @Column(name = "is_drug")
    private Boolean isDrug;

    @Column(name = "controlled_substance")
    private Boolean controlledSubstance;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "measurement_unit_id")
    private MeasurementUnit measurementUnit;

    @ManyToMany
    @JoinTable(
            name = "\"products_categories\"",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "cat_id")
    )
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ProductIngredient> ingredients = new HashSet<>();
}



package com.pharmacyerp.inventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "measurement_units")
public class MeasurementUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "m_id")
    private Integer id;

    @Column(name = "name", length = 30, nullable = false)
    private String name;

    @Column(name = "is_base_unit")
    private Boolean baseUnit;

    @Column(name = "con_fact")
    private Integer conversionFactor;

    @Column(name = "description")
    private String description;

    @Column(name = "sympol")
    private String symbol;
}

package com.pharmacyerp.inventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "Supplier")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supplier_id")
    private Integer id;

    @Column(name = "supplier_name", length = 30)
    private String supplierName;

    @Column(name = "supplier_phone", length = 30)
    private String supplierPhone;

    @Column(name = "supplier_email", length = 30)
    private String supplierEmail;

    @Column(name = "country", length = 30)
    private String country;

    @Column(name = "rating", precision = 10, scale = 2)
    private BigDecimal rating;

    @Column(name = "Currency", length = 30)
    private String currency;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "Active_status")
    private ActiveStatus activeStatus;

    public enum ActiveStatus {
        active, inactive
    }
}

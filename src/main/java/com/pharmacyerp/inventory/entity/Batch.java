package com.pharmacyerp.inventory.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "\"Batches\"")
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "batch_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Enumerated(EnumType.STRING)
    @Column(name = "stock_type", columnDefinition = "batch_stock_type_enum")
    private StockType stockType;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "batch_number", length = 50)
    private String batchNumber;

    @Column(name = "cost")
    private Integer cost;

    @Column(name = "supplier_id")
    private Integer supplierId;

    @Column(name = "manufacturing_date")
    private LocalDate manufacturingDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "receiving_date")
    private LocalDate receivingDate;

    @Column(name = "alert_date")
    private LocalDate alertDate;

    @Column(name = "clearance_date")
    private LocalDate clearanceDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_batch_id")
    private Batch parentBatch;

    @OneToMany(mappedBy = "parentBatch", cascade = CascadeType.ALL)
    private Set<Batch> childBatches = new HashSet<>();

    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<BatchShelfAllocation> shelfAllocations = new HashSet<>();

    public enum StockType {
        available, near_expiry, removed, expired, disposed, damaged, quarantined
    }
}

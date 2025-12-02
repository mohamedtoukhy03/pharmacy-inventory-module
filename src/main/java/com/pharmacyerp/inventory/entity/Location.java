package com.pharmacyerp.inventory.entity;

import com.pharmacyerp.inventory.enums.LocationStatus;
import com.pharmacyerp.inventory.enums.LocationType;
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
@Table(name = "Location")
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Integer id;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Enumerated(EnumType.STRING)
    @Column(name = "location_type")
    private LocationType locationType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_location")
    private Location parentLocation;

    @Column(name = "is_direct_to_main")
    private Boolean isDirectToMain;

    @Column(name = "address")
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private LocationStatus status;

    @OneToMany(mappedBy = "parentLocation", cascade = CascadeType.ALL)
    private Set<Location> childLocations = new HashSet<>();

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL)
    private Set<Shelf> shelves = new HashSet<>();
}

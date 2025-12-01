package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.entity.Location;

public record LocationDto(
        Integer id,
        String locationName,
        Location.LocationType locationType,
        Integer parentLocationId,
        String parentLocationName,
        Boolean isDirectToMain,
        String address,
        Location.LocationStatus status
) {
}

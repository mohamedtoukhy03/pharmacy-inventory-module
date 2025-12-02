package com.pharmacyerp.inventory.dto;

import com.pharmacyerp.inventory.enums.LocationStatus;
import com.pharmacyerp.inventory.enums.LocationType;

public record LocationDto(
        Integer id,
        String locationName,
        LocationType locationType,
        Integer parentLocationId,
        String parentLocationName,
        Boolean isDirectToMain,
        String address,
        LocationStatus status
) {
}

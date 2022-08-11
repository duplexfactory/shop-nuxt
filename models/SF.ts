export class District {
    id: number = -1;
    name: string = "";
    districts: DistrictLocation[] = [];
}

export class Location {
    id: string = "";
    address: string = "";
    weekday: string = "";
    weekend: string = "";
}

export class DistrictLocation {
    name: string = "";
    locations: Location[] = [];
}

export class SF {
    updated: number = 0;
    last_check: number = 0;

    stations: District[] = [];
    removed_stations: District[] = [];

    lockers: District[] = [];
    removed_lockers: District[] = [];

    raw_stations: District[] = [];
    s_etag: string;
    s_last_modified: string;

    raw_business_points: District[] = [];
    b_etag: string;
    b_last_modified: string;

    l_etag: string;
    l_last_modified: string;
}



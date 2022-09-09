import {defineEventHandler} from "h3";
import {mediaPriceSuggestionCollection} from "~/server/firebase/collections";
import {District, DistrictLocation, Location, SF} from "~/models/SF";
import {initMongo, miscCollection, sfLocationCollection} from "~/server/mongodb";
import dayjs from "dayjs";
import Dict = NodeJS.Dict;
import {FetchOptions} from "ohmyfetch";
import {JSDOM} from "jsdom";

const districtId = {
    香港島: 0,
    九龍: 1,
    新界: 2,
    離島: 3
};

enum SFUrl {
    Station = "https://htm.sf-express.com/hk/tc/dynamic_function/S.F.Network/SF_store_address/",
    Locker = "https://htm.sf-express.com/hk/tc/dynamic_function/S.F.Network/SF_Locker/",
    BusinessStation = "https://htm.sf-express.com/hk/tc/dynamic_function/S.F.Network/SF_business_station_address/"
}

const SFId = "sf"

export default defineEventHandler(async (event) => {

    await initMongo();

    const r = await miscCollection.findOne({
        _id: SFId
    }) as unknown as SF || new SF();

    const now = Date.now()
    if (dayjs(now).diff(r.last_check || 0, 'hour') > 6) {
        let updated = false;
        const oldStations = r.stations;
        try {
            const {
                districts,
                etag,
                lastModified
            } = await fetchAndParseSF(SFUrl.Station, false, r.s_etag, r.s_last_modified);
            r.s_etag = etag;
            r.s_last_modified = lastModified;
            updated = true;
            if (districts.length >= r.raw_stations.length)
                r.raw_stations = districts;
        } catch (e) {
            console.error(e);
        }
        try {
            const {
                districts,
                etag,
                lastModified
            } = await fetchAndParseSF(SFUrl.BusinessStation, false, r.b_etag, r.b_last_modified);
            r.b_etag = etag;
            r.b_last_modified = lastModified;
            updated = true;

            if (districts.length >= r.raw_business_points.length)
                r.raw_business_points = districts;
        } catch (e) {
            console.error(e);
        }
        if (updated) {
            r.stations = mergeDistricts(r.raw_business_points, r.raw_stations);
            r.removed_stations = getRemoved(r.stations, oldStations, r.removed_stations);
        }

        try {
            const {
                districts,
                etag,
                lastModified
            } = await fetchAndParseSF(SFUrl.Locker, true, r.l_etag, r.l_last_modified);
            r.l_etag = etag;
            r.l_last_modified = lastModified;

            updated = true;
            if (districts.length >= r.lockers.length) {
                const oldLockers = r.lockers;
                r.lockers = districts;
                r.removed_lockers = getRemoved(r.lockers, oldLockers, r.removed_lockers);
            }
        } catch (e) {
            console.error(e);
        }

        if (updated) {
            try {
                const locationList: any[] = [];

                function addToList(districts: District[]) {
                    for (const shippingPoint of districts) {
                        for (const district of shippingPoint.districts) {
                            for (const location of district.locations) {
                                const data: {} = Object.assign({}, location);
                                data["_id"] = data["id"];
                                delete data["id"];
                                locationList.push(data);
                            }
                        }
                    }
                }

                addToList(r.stations);
                addToList(r.lockers);
                addToList(r.removed_stations);
                addToList(r.removed_lockers);

                const bulk = sfLocationCollection.initializeUnorderedBulkOp();

                for (const location of locationList) {
                    bulk.find({_id: location._id}).upsert().updateOne({$set: location});
                }

                if (bulk.batches.length)
                    await bulk.execute();
            } catch (e) {
                console.error(e);
            }

            r.updated = now;
            r.last_check = now;
            await miscCollection.updateOne({_id: SFId}, {$set: r}, {upsert: true});
        } else {
            await miscCollection.updateOne({_id: SFId}, {$set: {last_check: now.valueOf()}}, {upsert: true});
        }
    }
    return {
        stations: r.stations,
        lockers: r.lockers,
        removed_stations: r.removed_stations,
        removed_lockers: r.removed_lockers,
    };
});

async function fetchAndParseSF(url: SFUrl, island: boolean, etag?: string, lastModified: string = "") {
    const opts: FetchOptions = {
        method: "GET",
        // timeout: 2000
        response: true
    };
    if (etag) {
        opts.headers = {
            "If-None-Match": etag,
            "If-Modified-Since": lastModified
        };
    }

    const res = await $fetch.raw(url, {
        ...opts
    })

    return {
        etag: res.headers.get("etag") || "",
        lastModified: res.headers.get("last-modified") || "",
        districts: parseSFDistrict(res._data as string, island)
    };
}

function parseSFDistrict(rawHtml: string, island: boolean) {
    const dList: District[] = [];
    let trs: any = [];

    // @ts-ignore
    const {document}: DOMWindow = (new JSDOM(rawHtml)).window;
    const tables = document.getElementsByTagName("table");
    for (let i = 0; i < tables.length; i++) {
        const table = tables.item(i);
        const d = new District();

        let p = table.previousElementSibling;
        if (!p)
            continue;

        d.name = p?.textContent.trim();
        while (!d.name) {
            p = p.previousElementSibling;
            d.name = p?.textContent.trim();
        }

        const allowed = ["香港島", "九龍", "新界", "離島"];
        if (island)
            allowed.push("離島");
        if (!allowed.includes(d.name))
            continue;

        d.id = districtId[d.name];

        const rows = table.getElementsByTagName("tbody")[0].rows;
        trs = Array.from(rows);
        const skip = ["點碼簡稱", "網點簡稱"].includes(trs[0].cells[2].textContent.trim());

        if (trs[0].cells.length < 5)
            trs.shift();

        let currentDl = new DistrictLocation();
        for (const tr of trs) {
            const name: string = tr.cells[0].textContent.trim();
            if (name === "地區") continue;

            let index = !name.includes("852") ? 1 : 0;
            if (!tr.cells[index + 1])
                continue;

            if (!name.includes("852")) {
                currentDl = new DistrictLocation();
                currentDl.name = name;
                d.districts.push(currentDl);
            }

            const l = new Location();
            l.id = tr.cells[index++].textContent.trim();

            if (skip)
                index++;

            l.address = tr.cells[index++].textContent.trim();
            l.weekday = tr.cells[index++].textContent.trim();
            l.weekend = !!tr.cells[index] ? tr.cells[index].textContent.trim() : "";
            currentDl.locations.push(l);
        }
        dList.push(d);
    }

    return dList.sort((a, b) => {
        return a.id - b.id;
    });
}

function mergeDistricts(a: District[], b: District[]) {
    for (const bd of b) {
        const foundD = a.find((ad) => {
            return ad.id === bd.id;
        });
        if (!foundD) {
            a.push(bd);
            continue;
        }

        for (const bds of bd.districts) {
            const foundDl = foundD.districts.find((ads) => {
                return ads.name === bds.name;
            });
            if (!foundDl) {
                foundD.districts.push(bds);
                continue;
            }

            for (const bl of bds.locations) {
                const foundL = foundDl.locations.find((al) => {
                    return al.id === bl.id;
                });
                if (!foundL) {
                    foundDl.locations.push(bl);
                }
            }
        }
    }

    return a;
}

export function getRemoved(newLocations: District[], oldLocations: District[], removedLocations: District[]) {
    const ignore = {};
    for (const nl of newLocations) {
        for (const d of nl.districts) {
            for (const l of d.locations) {
                ignore[l.id] = true;
            }
        }
    }

    const lookup = {};
    for (const [a, rl] of removedLocations.entries()) {
        lookup[rl.id] = {
            obj: rl,
            lookup: {}
        };
        for (const [b, d] of rl.districts.entries()) {
            lookup[rl.id].lookup[d.name] = d;
            for (const l of d.locations) {
                ignore[l.id] = true;
            }
        }
    }

    for (const oldLocation of oldLocations) {
        for (const district of oldLocation.districts) {
            for (const location of district.locations) {
                if (!ignore[location.id]) {
                    let foundDistrict = lookup[oldLocation.id];
                    if (!foundDistrict) {
                        const newDistrict = new District();
                        newDistrict.id = oldLocation.id;
                        newDistrict.name = oldLocation.name;
                        removedLocations.push(newDistrict);
                        foundDistrict = {
                            obj: newDistrict,
                            lookup: {}
                        };
                        lookup[oldLocation.id] = foundDistrict;
                    }

                    let foundDistrictLocation = foundDistrict.lookup[district.name];
                    if (!foundDistrictLocation) {
                        const newDistrictLocation = new DistrictLocation();
                        newDistrictLocation.name = district.name;
                        foundDistrict.obj.districts.push(newDistrictLocation);
                        foundDistrictLocation = newDistrictLocation;
                        foundDistrict.lookup[district.name] = foundDistrictLocation;
                    }

                    foundDistrictLocation.locations.push(location);
                }
            }
        }
    }
    return removedLocations;
}



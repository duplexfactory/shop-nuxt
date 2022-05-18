import {PageSearch} from "~/models/PageSearch";

export type SimpleIgPage = Pick<PageSearch,
    "_id" |
    "fullName" |
    "pk" |
    "username" |
    "extraData" |
    "businessRegistration" |
    "brickAndMortar" |
    "locations">;

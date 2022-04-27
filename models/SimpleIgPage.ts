import IgPage from "~/models/IgPage";

export type SimpleIgPage = Pick<IgPage,
    "_id" |
    "fullName" |
    "pk" |
    "username" |
    "extraData" |
    "businessRegistration" |
    "brickAndMortar" |
    "locations">;

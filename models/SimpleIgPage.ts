import IgPage from "~/models/IgPage";

export type SimpleIgPage = Pick<IgPage,
    "fullName" |
    "pk" |
    "username" |
    "extraData" |
    "businessRegistration" |
    "brickAndMortar" |
    "locations">;
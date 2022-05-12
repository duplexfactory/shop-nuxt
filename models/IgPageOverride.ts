import IgPageExtraData from "~/models/IgPageExtraData";

export default interface IgPageOverride {
    _id: string,

    adult?: boolean;

    // marked
    tags?: string[];
    businessRegistration?: boolean;
    brickAndMortar?: boolean;
    locations?: string[];

    extraData?: IgPageExtraData;
}

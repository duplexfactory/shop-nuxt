import IgPageExtraData from "~/models/IgPageExtraData";
import IgMedia from "~/models/IgMedia";

export class PageSearch {
    _id: number;
    username: string;
    fullName: string;
    biography: string;

    mediaCount: number;
    followerCount: number;
    followingCount: number;
    profilePicUrl: string;

    adult: boolean;

    tags: string[];
    businessRegistration: boolean;
    brickAndMortar: boolean;
    locations: string[];

    activeScore: number;

    mediaCodes: string[];

    nextFetch: number;
    fetching: boolean;
    profilePicLastFetch: number;

    lastActivity: number;
    lastMedia: number;
    lastMediaData?: IgMedia;

    extraData: IgPageExtraData;
}

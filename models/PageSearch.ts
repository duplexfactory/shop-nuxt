import IgPageExtraData from "~/models/IgPageExtraData";
import IgMedia from "~/models/IgMedia";

export class PageSearch {
    _id: string;
    pk?: number;
    username: string;
    fullName: string;
    biography: string;

    mediaCount: number;
    followerCount: number;
    followingCount: number;
    externalUrl: string;
    profilePicUrl: string;

    // private: boolean; // MongoDB remove directly, no need to mark.
    // deleted: boolean; // MongoDB remove directly, no need to mark.
    adult: boolean;

    lastMedia: number;
    // lastFetch: number // For crawler.
    nextFetch: number;
    profilePicLastFetch: number;
    lastActivity: number;
    // tier: number // For crawler.
    // temp?: boolean // For direct ig connect, not crawled.

    // marked
    tags: string[];
    businessRegistration: boolean;
    brickAndMortar: boolean;
    locations: string[];

    // computed
    activeScore: number;

    // denormalize
    lastMediaData?: IgMedia;
    mediaCodes: string[];
    igConnected: boolean;

    extraData?: IgPageExtraData;
}

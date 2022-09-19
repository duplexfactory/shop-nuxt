import IgPageExtraData from "~/models/IgPageExtraData";
import IgMedia from "~/models/IgMedia";
import IgPage from "~/models/IgPage";

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
    mediaIds?: string[]; // Only from official.
    igConnected: boolean;

    extraData?: IgPageExtraData;
}

export function createPageSearchDoc(id: string, page: Partial<IgPage>): Partial<PageSearch> {
    return {
        _id: id,
        pk: page.pk,
        username: page.username,
        fullName: page.fullName,
        biography: page.biography,

        mediaCount: page.mediaCount,
        followerCount: page.followerCount,
        followingCount: page.followingCount,
        externalUrl: page.externalUrl,
        profilePicUrl: page.profilePicUrl,

        adult: page.adult,

        tags: page.tags,
        businessRegistration: page.businessRegistration,
        brickAndMortar: page.brickAndMortar,
        locations: page.locations,

        activeScore: page.activeScore,

        mediaCodes: page.mediaCodes,
        mediaIds: page.mediaIds,

        nextFetch: page.nextFetch,

        lastActivity: page.lastActivity,
        lastMedia: page.lastMedia,
        lastMediaData: page.lastMediaData,

        extraData: page.extraData,
    };
}

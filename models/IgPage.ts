import IgStory from "~/models/IgStory";
import IgMedia from "~/models/IgMedia";
import IgTray from "~/models/IgTray";
import IgPageExtraData from "~/models/IgPageExtraData";

export default interface IgPage {
    pk: number
    username: string
    fullName: string
    biography: string

    mediaCount: number
    followerCount: number
    followingCount: number
    externalUrl: string
    profilePicUrl: string

    private: boolean
    deleted: boolean
    adult: boolean

    lastStory: number
    lastMedia: number
    lastFetch: number
    nextFetch: number
    profilePicLastFetch: number;
    lastActivity: number
    tier: number

    temp?: boolean

    // sub-docs
    stories: IgStory[]
    medias: IgMedia[] // max 252
    trays: IgTray[]

    // marked
    tags: string[];
    businessRegistration: boolean;
    brickAndMortar: boolean;
    locations: string[];

    // computed
    activeScore: number;

    // denormalize
    lastMediaData?: IgMedia;
    mediaUrls: string[];
    mediaCodes: string[];

    extraData?: IgPageExtraData;
}

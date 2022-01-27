import IgStory from "./IgStory";
import IgMedia from "./IgMedia";
import IgTray from "./IgTray";

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
    lastActivity: number
    tier: number

    // sub-docs
    stories: IgStory[]
    medias: IgMedia[] // max 252
    traies: IgTray[]

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
}

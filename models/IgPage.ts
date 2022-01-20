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

    lastStory: number
    lastMedia: number
    lastFetch: number
    lastActivity: number

    // sub-docs
    stories: IgStory[]
    medias: IgMedia[]
    traies: IgTray[]

    // marked
    tags: string[];
    businessRegistration: boolean;
    brickAndMortar: boolean;
    locations: string[];

    // computed
    activeScore: number;

    // denormalize
    mediaUrls: string[];
}

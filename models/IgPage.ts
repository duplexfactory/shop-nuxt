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
    lastFetch: number
    lastActivity: number

    // computed
    tags: string[];
    activeScore: number;

    // denormalize
    mediaUrls: string[];
}

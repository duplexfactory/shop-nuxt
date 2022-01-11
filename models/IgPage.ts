export default interface IgPage {
    id: number
    username: string
    fullName: string
    biography: string

    mediaCount: number
    followerCount: number
    followingCount: number
    externalUrl: string
    profilePicUrl: string

    private?: boolean
    deleted?: boolean

    lastStory?: number
    lastFetch: number
    lastActivity: number
}

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

    mediaUrls: string[];

    nextFetch: number;
    fetching: boolean;
}

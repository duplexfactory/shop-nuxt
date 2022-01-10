export default class Shop {
    ig_id: number
    ig_username: string
    tags: string[]

    private?: boolean;
    deleted?: boolean;

    activeScore?: number

    // denormalize
    icon: string
    medias: string[]
}

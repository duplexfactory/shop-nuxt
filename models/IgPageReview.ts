export default interface IgPageReview {
    pageId: string
    mediaCode?: string

    rating: number
    content: string
    created: number

    deleted: boolean
    ip: string

    imageUrls?: string[]
}

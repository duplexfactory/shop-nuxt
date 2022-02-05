export default interface IgPageReview {
    pagePk: number
    mediaId: string | undefined

    rating: number
    content: string
    created: number

    deleted: boolean
    ip: string
}

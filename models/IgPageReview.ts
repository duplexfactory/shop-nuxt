export default interface IgPageReview {
    pagePk: number
    mediaCode: string | undefined

    rating: number
    content: string
    created: number

    deleted: boolean
    ip: string
}

export default interface IgPageReview {
    pageId: string
    mediaCode: string | undefined

    rating: number
    content: string
    created: number

    deleted: boolean
    ip: string
}

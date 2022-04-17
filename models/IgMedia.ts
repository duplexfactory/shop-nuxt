export default interface IgMedia {
    id: string;
    code: string;
    pagePk: number;
    caption?: string;

    likeCount: number;
    commentCount: number;

    takenAt: number;

    price?: number;
    patchPrice?: number;
}

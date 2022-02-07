export default interface IgMedia {
    id: string;
    code: string;
    pagePk: number;
    coverImageUrl: string;
    caption?: string;

    likeCount: number;
    commentCount: number;

    takenAt: number;
}

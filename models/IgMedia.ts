export default interface IgMedia {
    id: string;
    code: string;
    coverImageUrl: string;
    caption?: string;

    likeCount: number;
    commentCount: number;

    takenAt: number;
}

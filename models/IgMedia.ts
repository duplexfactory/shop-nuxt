export default interface IgMedia {
    code: string;
    pageId: string;
    caption?: string;
    mediaId?: string; // Only from official.

    takenAt: number;

    price?: number;
    patchPrice?: number;

    mediaUrl?: string; // Only from official.
    mediaList?: string[]; // Only from official.
}














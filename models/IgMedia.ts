export default interface IgMedia {
    code: string;
    pageId: string;
    caption?: string;
    mediaId?: string; // Only from official.
    mediaType?: "CAROUSEL_ALBUM" | "IMAGE" | "VIDEO"; // Only from official.
    thumbnailUrl?: string; // Only from official & type VIDEO.

    takenAt: number;

    price?: number;
    patchPrice?: number;

    mediaUrl?: string; // Only from official.
    mediaList?: string[]; // Only from official & type CAROUSEL_ALBUM.
}














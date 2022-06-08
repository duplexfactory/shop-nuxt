export default interface IgMedia {
    code: string;
    pageId: string;
    caption?: string;

    takenAt: number;

    price?: number;
    patchPrice?: number;

    mediaUrl?: string; // only from official
}

export default interface IgPageCommerceData {
    _id: string; // Same as IgMedia code.
    active: boolean;
    customPrice: boolean;
    stock?: number;
}

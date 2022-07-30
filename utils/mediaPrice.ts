import IgMedia from "~/models/IgMedia";

export function mediaPrice(media?: IgMedia): number {
    if (!media) {
        return 0;
    }
    if (media.patchPrice !== undefined) {
        return media.patchPrice
    }
    return media.price ?? 0
}

export function formatMediaPrice(price: number): string {
    return "HK$ " + (price ? price : "-")
}

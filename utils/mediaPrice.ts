import IgMedia from "~/models/IgMedia";

export function mediaPrice(media?: Pick<IgMedia, "price" | "patchPrice">): number {
    if (!media) {
        return 0;
    }
    if (media.patchPrice !== undefined) {
        return media.patchPrice
    }
    return media.price ?? 0
}

export function formatMediaPrice(price: number): string {
    const prefix = "HK$ "
    if (price === 0) {
        return "免費"
    }
    return prefix + (price ? price : "-")
}

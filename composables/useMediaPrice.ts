import IgMedia from "~/models/IgMedia";

export default function useMediaPrice() {

    function mediaPrice(media?: IgMedia): number {
        if (!media) {
            return 0;
        }
        if (media.patchPrice !== undefined) {
            return media.patchPrice
        }
        return media.price ?? 0
    }

    function formatMediaPrice(price: number): string {
        return "HK$ " + (price ? price : "-")
    }

    return {
        mediaPrice,
        formatMediaPrice
    }
}
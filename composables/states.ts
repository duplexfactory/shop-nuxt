import {SimpleIgPage} from "~/models/SimpleIgPage";
import IgMedia from "~/models/IgMedia";

export const useShowMediaModal = () => useState<boolean>('showMediaModal', () => false)
export const useShowingMediaModalData = () => useState<{

    // Either code or media.
    code?: string,
    media?: IgMedia,

    simplePage: SimpleIgPage
}>('showingMediaModalData', () => ({
    simplePage: {
        fullName: "",
        pk: 0,
        username: ""
    }
}))

export const useShowSearchModal = () => useState<boolean>('showSearchModal', () => false)

export const useShowAgeRestrictedModal = () => useState<boolean>('showAgeRestrictedModal', () => false)
export const useShowAgeRestrictedContent = () => useState<boolean>('showAgeRestrictedContent', () => false)
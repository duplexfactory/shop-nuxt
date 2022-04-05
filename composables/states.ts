import {SimpleIgPage} from "~/models/SimpleIgPage";
import IgMedia from "~/models/IgMedia";

export const useShowMediaModal = () => useState<boolean>('showMediaModal', () => false)
export const useShowingMediaModalData = () => useState<{

    // Either code or media.
    code?: string,
    media?: IgMedia,

    pagePk?: number,
    simplePage?: SimpleIgPage
}>('showingMediaModalData', () => ({
    simplePage: {
        fullName: "",
        pk: 0,
        username: "",
        businessRegistration: false,
        brickAndMortar: false,
        locations: []
    }
}))

export const useShowSearchModal = () => useState<boolean>('showSearchModal', () => false)

export const useShowAgeRestrictedModal = () => useState<boolean>('showAgeRestrictedModal', () => false)
export const useShowAgeRestrictedContent = () => useState<boolean>('showAgeRestrictedContent', () => false)


export const useIsLoggedIn = () => useState<boolean | null>('isLoggedIn', () => null)


export enum ScreenSize {
    DEFAULT,
    SM,
    MD,
    LG,
    XL,
    XXL
}

export const useScreenSize = () => useState<ScreenSize>('screenSize', () => ScreenSize.DEFAULT)

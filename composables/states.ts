import {SimpleIgPage} from "~/models/SimpleIgPage";
import IgMedia from "~/models/IgMedia";
import {User} from "firebase/auth"

export const useShowMediaModal = () => useState<boolean>('showMediaModal', () => false)
export const useShowingMediaModalData = () => useState<{

    code?: string,
    mediaId?: string, // Official
    media?: IgMedia,

    pageId?: string,
    simplePage?: SimpleIgPage
}>('showingMediaModalData', () => ({
    simplePage: {
        _id: "",
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
export const useIsIgConnected = () => useState<boolean>('isIgConnected', () => false)
export const useIgUsername = () => useState<string>('igUsername', () => "")
export const useIgPageId = () => useState<string>('igPageId', () => "")
export const useCurrentUser = () => useState<User | null>('currentUser', () => null)

export const useLightBox = () => useState<{
    imageUrls: string[],
    currentIndex: number
} | null>('lightBox', () => null)

export enum ScreenSize {
    DEFAULT,
    SM,
    MD,
    LG,
    XL,
    XXL
}

export const useScreenSize = () => useState<ScreenSize>('screenSize', () => ScreenSize.DEFAULT)

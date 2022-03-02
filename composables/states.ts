export const useShowMediaModal = () => useState<boolean>('showMediaModal', () => false)
export const useShowingMediaModalData = () => useState<{code: string, pagePk: number, username: string}>('showingMediaModalData', () => ({code: "", pagePk: 0, username: ""}))

export const useShowSearchModal = () => useState<boolean>('showSearchModal', () => false)

export const useShowAgeRestrictedModal = () => useState<boolean>('showAgeRestrictedModal', () => false)
export const useShowAgeRestrictedContent = () => useState<boolean>('showAgeRestrictedContent', () => false)
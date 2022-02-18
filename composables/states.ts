export const useShowMediaModal = () => useState<boolean>('showMediaModal', () => false)
export const useShowingMediaModalData = () => useState<{code: string, pagePk: number, username: string}>('showingMediaModalData', () => ({code: "", pagePk: 0, username: ""}))

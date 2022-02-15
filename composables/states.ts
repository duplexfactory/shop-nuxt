export const useShowMediaModal = () => useState<boolean>('showMediaModal', () => false)
export const useShowingMediaModalData = () => useState<{code: string, pagePk: number}>('showingMediaModalData', () => ({code: '', pagePk: 0}))

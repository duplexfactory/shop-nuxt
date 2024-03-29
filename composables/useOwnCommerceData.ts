import {IgPageCommerceData} from "~/models/IgPageCommerceData"
import type {Ref} from "vue"

export default function useOwnCommerceData() {

    const igPageId = useIgPageId()
    const pageCommerceData = useIgPageCommerceData()

    const fetchPending: Ref<ReturnType<typeof useContentKeyedLazyFetch>['pending']> = ref(null)
    const fetchRefresh: Ref<ReturnType<typeof useContentKeyedLazyFetch>['refresh']> = ref(null)
    const fetchError: Ref<Ref<true | Error>> = ref(null)

    async function fetchPageCommerceData() {
        if (!igPageId.value) {
            return
        }
        const {
            data,
            pending,
            refresh,
            error
        } = await useContentKeyedLazyFetch(`/api/shop/id/${igPageId.value}/commerce-data`)
        fetchPending.value = pending
        fetchRefresh.value = refresh
        fetchError.value = error
        watch(pending, (newPending) => {
            if (!error.value && data.value)
                pageCommerceData.value = data.value.commerceData
        }, {immediate: true})
    }

    return {
        pageCommerceData,
        fetchPageCommerceData,
        fetchPending,
        fetchRefresh,
        fetchError
    }
}

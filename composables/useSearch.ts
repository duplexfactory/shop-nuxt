import {PageSearch} from "~/models/PageSearch";
import {PageSearchQuery} from "~/models/PageSearchQuery";
import {PaginationQuery} from "~/models/PaginationQuery";
import {useShowAgeRestrictedContent} from "~/composables/states";
import type {Ref} from "vue";

export default function () {

    let searchPending = ref(false);

    const searchData: Ref<Ref<{pages: PageSearch[], count: number}>> = ref(null);
    const searchDataBuffer: Ref<{pages: PageSearch[], count: number}> = ref(null);
    const safeSearchData = computed(() => {
        if (searchPending.value && !!searchDataBuffer.value) {
            return searchDataBuffer.value;
        }
        else if (!!searchData.value && !!searchData.value.value) {
            return searchData.value.value;
        }
        return {
            pages: [],
            count: 0
        };
    })

    // const double = computed(() => count.value * 2)

    const showAgeRestrictedContent = useShowAgeRestrictedContent();

    async function search(q: PageSearchQuery, p: PaginationQuery = new PaginationQuery()) {
        const params = {
            ...p
        };
        if (!!q.keyword) {
            params["q"] = q.keyword;
        }
        if (!!q.tag) {
            params["tag"] = q.tag;
        }
        if (q.br !== undefined) {
            params["br"] = q.br;
        }
        if (q.phy !== undefined) {
            params["phy"] = q.phy;
        }

        if (showAgeRestrictedContent.value) {
            params["adult"] = "true";
        }

        const {data, pending} = useLazyFetch(`/api/search`, {params});
        if (!!searchData.value && !!searchData.value.value) {
            searchDataBuffer.value = searchData.value.value;
        }
        searchData.value = data;
        searchPending = pending;

        // if (p.skip === 0) {
        //     searchResults.value = data.value.pages;
        // }
        // else {
        //     searchResults.value.push(...data.value.pages);
        // }
    }
    return {
        searchResults: computed(() => safeSearchData.value.pages),
        searchResultTotalCount: computed(() => safeSearchData.value.count),
        searchPending,
        search
    }
}
import {PageSearch} from "~/models/PageSearch";
import {PageSearchQuery} from "~/models/PageSearchQuery";
import {PaginationQuery} from "~/models/PaginationQuery";
import {useShowAgeRestrictedContent} from "~/composables/states";

export default function () {

    const searchResults = ref<PageSearch[]>([]);
    const searchResultTotalCount = ref<number>(0);
    const searchPending = ref<boolean>(false);

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

        const {data} = useLazyFetch(`/api/search`, {params, server: false});
        searchPending.value = true;
        watch(data, (newData) => {
            const {count, pages} = newData;
            searchResultTotalCount.value = count;
            searchResults.value = pages;

            searchPending.value = false;
        })

        // if (p.skip === 0) {
        //     searchResults.value = data.value.pages;
        // }
        // else {
        //     searchResults.value.push(...data.value.pages);
        // }
    }
    return {
        searchResults,
        searchResultTotalCount,
        searchPending,
        search
    }
}
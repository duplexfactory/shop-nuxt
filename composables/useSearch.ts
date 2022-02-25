import {PageSearch} from "~/models/PageSearch";
import {PageSearchQuery} from "~/models/PageSearchQuery";
import {PaginationQuery} from "~/models/PaginationQuery";

export default function () {

    const searchResults = ref<PageSearch[]>([]);
    const searchResultTotalCount = ref<number>(0);

    // const double = computed(() => count.value * 2)

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

        const {data} = await useFetch(`/api/search`, {params});
        searchResultTotalCount.value = data.value.count;

        searchResults.value = data.value.pages;
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
        search
    }
}
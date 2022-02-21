import {PageSearch} from "~/models/PageSearch";
import {PageSearchQuery} from "~/models/PageSearchQuery";
import {PaginationQuery} from "~/models/PaginationQuery";

export default function () {
    // const count = ref(0);
    // const double = computed(() => count.value * 2)
    async function search(q: PageSearchQuery, p: PaginationQuery = new PaginationQuery()): Promise<PageSearch[]> {
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
        return data.value.pages;
    }
    return {
        search
    }
}
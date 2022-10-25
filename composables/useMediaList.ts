import IgMedia from "~/models/IgMedia";
import type {Ref} from "vue";

export default function useMediaList() {

    // Medias
    const mediaPending = ref(false)
    const medias = ref<IgMedia[]>([])
    const limit = ref(12);

    // Official only
    const cursors = ref(null)

    const {
        getAuthHeader,
        headersToObject
    } = useAuth()

    async function fetchOwnOfficialMedias(prev: boolean = false) {
        const params = {
            limit: limit.value
        }

        if (prev) {
            if (cursors.value != null && cursors.value["before"]) {
                params["before"] = cursors.value["before"]
            }
            if (medias.value.length) {
                params["since"] = medias.value[0].takenAt
            }
        }
        else {
            if (cursors.value != null && cursors.value["after"]) {
                params["after"] = cursors.value["after"]
            }
            if (medias.value.length) {
                params["until"] = medias.value[medias.value.length - 1].takenAt
            }
        }

        mediaPending.value = true
        const {
            data,
            pending,
            error
        } = await useContentKeyedFetch(`/api/media/official/list`, { headers: headersToObject(await getAuthHeader()), params })
        if (!!data.value) {
            medias.value = data.value["medias"]

            cursors.value = data.value["paging"]["cursors"]
            if (!data.value["paging"]["previous"]) {
                delete cursors.value["before"]
            }
            if (!data.value["paging"]["next"]) {
                delete cursors.value["after"]
            }
        }
        mediaPending.value = false
    }

    async function fetchOfficialMedias(pageId: string) {
        const params = {
            id: pageId,
            limit: limit.value
        }

        const ms = medias.value
        if (ms.length) params["until"] = ms[ms.length - 1].takenAt

        mediaPending.value = true
        const {data: mediaData, pending} = await useContentKeyedLazyFetch(`/api/media/official/list`, {params})
        appendMediaData(mediaData as Ref<{medias: IgMedia[], paging: { cursors: {before: string, after: string} }}>);
    }

    async function fetchDynamoMedias(username: string) {
        const params = {
            username,
            limit: limit.value
        }
        if (medias.value.length != 0) {
            params["before"] = medias.value[medias.value.length - 1].takenAt
        }

        mediaPending.value = true
        const {data: mediaData, pending} = await useContentKeyedLazyFetch(`/api/media/list`, {params})
        appendMediaData(mediaData as Ref<{medias: IgMedia[]}>);
    }

    function appendMediaData(mediaData: Ref<{medias: IgMedia[]}>) {
        watch(mediaData, (newData) => {
            if (!!newData) {
                medias.value = [...medias.value, ...newData.medias]
                mediaPending.value = false
            }
        }, {immediate: true})
    }

    return {
        mediaPending,
        medias,
        limit,
        cursors,
        fetchOwnOfficialMedias,
        fetchOfficialMedias,
        fetchDynamoMedias
    }
}

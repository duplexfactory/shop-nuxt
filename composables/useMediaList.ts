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

        if (cursors.value != null) {
            if (prev) {
                params["before"] = cursors.value["before"]
            }
            else {
                params["after"] = cursors.value["after"]
            }
        }

        const {
            data,
            pending,
            error
        } = await useFetch(`/api/media/list/official`, { headers: headersToObject(await getAuthHeader()), params })
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

        const {data: mediaData, pending} = await useLazyFetch(`/api/media/list/official`, {params})
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

        const {data: mediaData, pending} = await useLazyFetch(`/api/media/list`, {params})
        appendMediaData(mediaData as Ref<{medias: IgMedia[]}>);
    }

    function appendMediaData(mediaData: Ref<{medias: IgMedia[]}>) {
        if (mediaData.value != null) {
            medias.value = [...medias.value, ...mediaData.value.medias]
            mediaPending.value = false
        } else {
            // Client navigation.
            watch(mediaData, (newData) => {
                medias.value = [...medias.value, ...newData.medias]
                mediaPending.value = false
            })
        }
    }

    return {
        mediaPending,
        medias,
        cursors,
        fetchOwnOfficialMedias,
        fetchOfficialMedias,
        fetchDynamoMedias
    }
}

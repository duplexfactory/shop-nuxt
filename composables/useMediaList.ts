import IgMedia from "~/models/IgMedia";
import type {Ref} from "vue";

export default function useMediaList() {

    // Medias
    const mediaPending = ref(false)
    const medias = ref<IgMedia[]>([])
    const limit = ref(12);

    async function fetchOwnOfficialMedias() {
        const params = {
            limit: limit.value
        }

        const ms = medias.value
        if (ms.length) params["until"] = ms[ms.length - 1].takenAt

        const {getAuthHeader} = useAuth()
        const res = await $fetch(`/api/media/list/official`, { headers: await getAuthHeader(), params})
        medias.value = [...medias.value, ...res["medias"]]
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
        appendMediaData(mediaData as Ref<{medias: IgMedia[]}>);
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
        fetchOwnOfficialMedias,
        fetchOfficialMedias,
        fetchDynamoMedias
    }
}

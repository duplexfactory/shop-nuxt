import IgMedia from "~/models/IgMedia";

export default function useMediaList() {

    // Medias
    const mediaPending = ref(false)
    const medias = ref<IgMedia[]>([])

    async function fetchOfficialMedias(pageId: string) {
        const params = {
            id: pageId,
            limit: 12
        }

        const ms = medias.value
        if (ms.length) params["until"] = ms[ms.length - 1].takenAt

        const {data: mediaData, pending} = await useLazyFetch(`/api/media/list/official`, {params})
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

    async function fetchDynamoMedias(username: string) {
        const params = {
            username,
            limit: 12
        }
        if (medias.value.length != 0) {
            params["before"] = medias.value[medias.value.length - 1].takenAt
        }

        const {data: mediaData, pending} = await useLazyFetch(`/api/media/list`, {params})
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
        fetchOfficialMedias,
        fetchDynamoMedias
    }
}

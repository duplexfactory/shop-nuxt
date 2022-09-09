import IgPageReview from "~/models/IgPageReview"

export default function useCreateReview() {

    const reviewingCode = ref("")
    const reviewingPageId = ref("")
    const isCreatingReview = ref(false)
    const rating = ref(5)
    const content = ref("")

    const imageFiles = ref<File[]>([])

    async function createReview() {
        isCreatingReview.value = true

        const body: Omit<IgPageReview, "created" | "deleted" | "ip"> = {
            pageId: reviewingPageId.value,
            rating: rating.value,
            content: content.value,
        }
        if (reviewingCode.value.length !== 0) {
            body.mediaCode = reviewingCode.value
        }
        if (imageFiles.value.length !== 0) {
            // Upload image first.
            let formData = new FormData()
            for (const [i, image] of imageFiles.value.entries()) {
                formData.append( `image[${i}]`, image)
            }
            const {
                urls
            } = await $fetch(
                '/api/file/review',
                {
                    method: 'POST',
                    body: formData
                }
            )

            body.imageUrls = urls
        }
        await $fetch('/api/review', {method: 'POST', body})

        isCreatingReview.value = false

        resetCreateReview()

    }

    function resetCreateReview() {
        rating.value = 0
        content.value = ""
        imageFiles.value = []
    }

    return {
        reviewingCode,
        reviewingPageId,
        isCreatingReview,
        rating,
        content,
        imageFiles,
        createReview,
        resetCreateReview
    }
}

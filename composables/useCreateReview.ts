import { ref, computed, onMounted } from 'vue';

export default function useCreateReview() {

    const reviewingCode = ref<string>("");
    const reviewingPageId = ref<string>("");
    const isCreatingReview = ref<boolean>(false);
    const rating = ref<number>(0);
    const content = ref<string>("");

    async function createReview() {
        isCreatingReview.value = true;

        const body: any = {
            pagePk: reviewingPageId.value,
            rating: rating.value,
            content: content.value,
        };
        if (reviewingCode.value.length !== 0) {
            body.mediaCode = reviewingCode.value;
        }
        await $fetch('/api/review', { method: 'POST', body})

        isCreatingReview.value = false;

        resetCreateReview();

    }

    function resetCreateReview() {
        rating.value = 0;
        content.value = "";
    }

    // onMounted(() => console.log('useCounter mounted'));

    return {
        reviewingCode,
        reviewingPageId,
        isCreatingReview,
        rating,
        content,
        createReview,
        resetCreateReview
    };
}

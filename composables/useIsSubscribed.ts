export default function useIsSubscribed() {

    const igUsername = useIgUsername()

    const isSubscribed = computed(() => {
        return [
            // "valentim.manas.cs"
        ].includes(igUsername.value)
    })

    return {
        isSubscribed
    }
}
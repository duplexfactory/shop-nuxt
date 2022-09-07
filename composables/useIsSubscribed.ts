export default function useIsSubscribed() {

    const igUsername = useIgUsername()

    const isSubscribed = computed(() => {
        return [
            "myyororoom_"
            // "valentim.manas.cs"
        ].includes(igUsername.value)
    })

    return {
        isSubscribed
    }
}
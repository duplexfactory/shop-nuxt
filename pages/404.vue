<template>
    <div class="container mx-auto self-center mt-56 md:mt-64">
        <div class="text-pink-500 text-8xl font-bold w-full text-center mb-4">
            404
        </div>
        <div class="text-gray-600 text-xl w-full text-center">
            頁面不存在或已被移除
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        error: Object
    })

    const handleError = () => clearError({redirect: '/'})
</script>

<style scoped>
</style>

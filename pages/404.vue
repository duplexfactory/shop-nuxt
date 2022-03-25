<template>
    <NotFound :error="error"/>
</template>

<script setup>
    const props = defineProps({
        error: Object
    })
</script>

<style scoped>
</style>

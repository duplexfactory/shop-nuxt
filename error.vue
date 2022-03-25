<template>
  <NuxtLayout name="default">
    <NotFound :error="error"/>
  </NuxtLayout>
</template>

<script setup>
const props = defineProps({
  error: Object
})
</script>

<style scoped>
</style>


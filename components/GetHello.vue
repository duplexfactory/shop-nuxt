<script setup lang="ts">
const { data } = await useFetch('/api/hello')
</script>

<template>
  <div>
    <p>{{ data.message }}</p>
  </div>
</template>
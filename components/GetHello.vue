<script setup>
const { data } = await useFetch('/api/hello')
// const c = await useAsyncData('count', () => $fetch('/api/lv1/count'), { pick: ['title', 'count'] })
const c = await useFetch('/api/lv1/count', { pick: ['title', 'count'] })
const count = c.data.value.count;
console.log(c.data.value)
</script>

<template>
  <div>
    <p>{{ data.message }}</p>
    <p>{{ count || 'x' }}</p>
  </div>
</template>
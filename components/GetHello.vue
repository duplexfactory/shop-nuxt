<script setup>
// const c = await useAsyncData('count', () => $fetch('/api/lv1/count'), { pick: ['title', 'count'] })
const [{ data }, count] = await Promise.all([
  useFetch("/api/hello"),
  useFetch("/api/lv1/count", { pick: ["title", "count"] }).then(
    ({ data }) => data.value.count
  ),
]);

const { counter, inc, dec } = goSick();
</script>

<template>
  <div>
    <p>{{ data.message }}</p>
    <p>Global count with API: {{ count || "x" }}</p>

    <div>
      Local Count with Composables: {{ counter }}
      <button @click="inc">+</button>
      <button @click="dec">-</button>
    </div>

    <nuxt-link to=/>back</nuxt-link>
  </div>
</template>
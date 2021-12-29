<script setup>
// const c = await useAsyncData('count', () => $fetch('/api/lv1/count'), { pick: ['title', 'count'] })
const [{ data }, count, s] = await Promise.all([
  useFetch("/api/hello"),
  useFetch("/api/lv1/count", { pick: ["title", "count"] }).then(
    ({ data }) => data.value.count
  ),
  goSick(5),
]);
</script>

<template>
  <div>
    <p>{{ data.message }}</p>
    <p>{{ count || "x" }}</p>
    <p>{{ s }}</p>
  </div>
</template>
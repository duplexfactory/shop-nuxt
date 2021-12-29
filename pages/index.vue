<script setup>
const header = ref('Nuxt 3 starter template')
const { counter } = goSick();
</script>

<template>
  <div>
    <h1 class="rounded-md bg-green-200 text-xl text-green-700 font-bold">
      {{ header }}
      {{ counter }}
      with <a href="https://vueuse.org/" target="_blank">VueUse</a> and <a href="https://windicss.org/" target="_blank">Windi CSS</a>.
    </h1>
    <p>
      Edit <strong>layouts/default.vue</strong> and <strong>windi.config.js</strong>.
    </p>
    <nuxt-link to="/hello">HEEEEEE</nuxt-link>
  </div>
</template>

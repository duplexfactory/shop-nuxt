<script setup>
const props = defineProps({
  title: String
})
</script>

<template>
<!--  <div class="inline-block text-pink-400 text-xs border border-pink-400 px-2 py-1 rounded-md">-->
<!--    {{ title }}-->
<!--  </div>-->

  <div class="inline-block text-pink-600 text-sm">
    {{ `#${title}` }}
  </div>
</template>

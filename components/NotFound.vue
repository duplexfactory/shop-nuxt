<template>
  <div class="absolute flex flex-col justify-center" style="min-height: 100%; min-width: 100%">
    <div class="container mx-auto">
      <div class="w-full text-center ">
        <div class="text-pink-500 text-8xl font-bold mb-4">404</div>
        <div class="text-gray-600 text-xl">頁面不存在或已被移除</div>
        <div class="mt-3 flex justify-center"><nuxt-link to="/" class="btn-primary">返回首頁</nuxt-link></div>
      </div>
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

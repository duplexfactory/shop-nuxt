<template>
  <div class="container mx-auto">
    <h1 class="mt-8 text-2xl md:text-4xl font-bold">
      商戶登入
    </h1>
    <input v-model="username" class="mt-4 block text-input-primary" type="text" name="username" placeholder="用戶名">
    <input v-model="password" class="mt-4 block text-input-primary" type="password" name="password" placeholder="密碼">
    <button @click="login" class="mt-4 btn btn-primary">登入</button>

    <div class="mt-8 text-gray-500">
      <span class="mr-2">未有帳戶？</span><nuxt-link to="/verify" class="hover:underline cursor-pointer">立即申請</nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">

const username = ref("");
const password = ref("");
function login() {

}

</script>

<style scoped>

</style>
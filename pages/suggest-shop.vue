<script setup lang="ts">

const nuxt = useNuxtApp();
const username = ref("");
const isSubmitting = ref(false);

async function submit() {
  if (username.value === "") {
    nuxt.$toast.error("請輸入IG Shop的名稱！");
    return;
  }

  isSubmitting.value = true;
  await useContentKeyedFetch('/api/suggest/shop', { method: 'POST', body: { username: username.value }});
  isSubmitting.value = false;

  // Reset
  username.value = "";

  nuxt.$toast.success("已成功提交，感謝你的建議，我們將儘快處理。");

}

</script>

<template>
  <div>
    <section>
      <div class="container mx-auto">
        <div class="md:grid grid-cols-2 gap-8">
          <div class="col-span-1">
            <h1 class="text-4xl md:text-5xl font-bold ">
              你想找的IG Shop不在Shoperuse上？
            </h1>
            <h2 class="text-xl md:text-2xl font-bold mt-8">
              立即向我們提供IG Shop的名稱，幫助我們建構更完整的平台！
            </h2>
            <input v-model="username" class="text-input-primary w-full mt-8" type="text" name="username" placeholder="IG Shop名稱（需與Instagram上相同）">
            <button :disabled="isSubmitting" @click="submit" class="mt-8 btn btn-primary">提交</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>

section {
  @apply py-16;
}

section:nth-child(even) {
  @apply bg-gray-100;
}

</style>
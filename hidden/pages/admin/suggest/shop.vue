<template>
  <div class="container mx-auto">
    <div class="table w-full">

      <div class="table-row">
        <div class="table-cell">
          ID
        </div>
        <div class="table-cell">
          Created Date
        </div>
        <div class="table-cell">
          Username
        </div>
        <div class="table-cell">

        </div>

      </div>


      <div v-for="suggestion in suggestions"
           :key="suggestion.id"
           class="table-row">
        <div class="table-cell">
          {{ suggestion.id }}
        </div>
        <div class="table-cell">
          {{ tsToDateString(suggestion.created) }}
        </div>
        <div class="table-cell">
          <a class="hover:underline" :href="`https://www.instagram.com/${suggestion.username}/`" target="_blank">{{ suggestion.username }}</a>
        </div>
        <div class="table-cell">
          <button @click="approveRecord(suggestion.id)" class="btn-primary btn-sm mr-2">批准</button>
          <button @click="deleteRecord(suggestion.id)" class="btn-outline btn-sm">刪除</button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import dayjs from "dayjs";
import type {Ref} from "vue";
import ShopSuggestion from "~/models/ShopSuggestion";

const nuxt = useNuxtApp();
const { data } = await useContentKeyedFetch('/api/admin/suggest/shop/list', {server: false});
const suggestions: Ref<ShopSuggestion[]> = ref<ShopSuggestion[]>([]);
watch(data, (newData) => suggestions.value = newData.suggestions);

function tsToDateString(ts) {
  return dayjs(ts).format('DD/MM/YYYY')
}

async function approveRecord(id: string) {
  const { data, error } = await useContentKeyedFetch('/api/admin/suggest/shop/approve', { method: 'POST', params: {id}});
  if (error.value !== null) {
    nuxt.$toast.error("失敗！");
    return;
  }
  suggestions.value = suggestions.value.filter((s) => s.id !== id);
  nuxt.$toast.success("成功！");
}

async function deleteRecord(id: string) {
  const { data, error } = await useContentKeyedFetch('/api/admin/suggest/shop', { method: 'DELETE', params: {id}});
  if (error.value !== null) {
    nuxt.$toast.error("失敗！");
    return;
  }
  suggestions.value = suggestions.value.filter((s) => s.id !== id);
  nuxt.$toast.success("成功！");
}

</script>

<style scoped>

</style>
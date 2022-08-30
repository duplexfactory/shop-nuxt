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
          Media Code
        </div>
        <div class="table-cell">
          Price
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
          <a class="hover:underline" :href="`https://www.instagram.com/p/${suggestion.code}/`" target="_blank">{{ suggestion.code }}</a>
        </div>
        <div class="table-cell">
          {{ suggestion.price }}
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
import MediaPriceSuggestion from "~/models/MediaPriceSuggestion";
import type {Ref} from "vue";

const nuxt = useNuxtApp();
const { data } = await useContentKeyedFetch('/api/admin/suggest/media-price/list', {server: false});
const suggestions: Ref<MediaPriceSuggestion[]> = ref<MediaPriceSuggestion[]>([]);
watch(data, (newData) => suggestions.value = newData.suggestions);

function tsToDateString(ts) {
  return dayjs(ts).format('DD/MM/YYYY')
}

async function approveRecord(id: string) {
  try {
    await $fetch('/api/admin/suggest/media-price/approve', {method: 'POST', params: {id}});
    suggestions.value = suggestions.value.filter((s) => s.id !== id);
    nuxt.$toast.success("成功！");
  }
  catch (e) {
    nuxt.$toast.error("失敗！");
  }
}

async function deleteRecord(id: string) {
  const { data, error } = await useContentKeyedFetch('/api/admin/suggest/media-price', {method: 'DELETE', params: {id}});
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
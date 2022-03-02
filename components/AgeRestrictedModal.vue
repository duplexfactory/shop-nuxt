<template>
  <LazyModal v-if="showAgeRestrictedModal" @close="showAgeRestrictedModal = false">
    <template v-slot:body class="h-full">
      <div>
        <div class="p-4 mx-auto w-full md:w-3/5 text-center">
          WARNING : THIS ARTICLE CONTAINS MATERIAL WHICH MAY OFFEND AND MAY NOT BE DISTRIBUTED, CIRCULATED, SOLD, HIRED, GIVEN, LENT, SHOWN, PLAYED OR PROJECTED TO A PERSON UNDER THE AGE OF 18 YEARS
          警告：本物品內容可能令人反感，不可將本物品派發、傳閱、出售、出租、交給或出借予年齡未滿18歲的人士或將本物品向該等人士出示、播放或放映。
        </div>

        <div>
          <button class="w-1/2 p-4" @click="showAgeRestrictedContent = false; showAgeRestrictedModal = false">離開</button>
          <button class="w-1/2 p-4 bg-pink-400 text-white" @click="showAgeRestrictedContent = true; showAgeRestrictedModal = false;">我已滿18歲</button>
        </div>

      </div>

    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import {useShowAgeRestrictedContent, useShowAgeRestrictedModal} from "~/composables/states";

const showAgeRestrictedModal = useShowAgeRestrictedModal();
const showAgeRestrictedContent = useShowAgeRestrictedContent();


</script>

<style scoped>

</style>
<template>
  <ConfirmModal @close="showAgeRestrictedModal = false"
                @confirm="showAgeRestrictedContent = true; showAgeRestrictedModal = false;"
                cancelButtonTitle="離開"
                confirmButtonTitle="我已滿18歲">
    <template #body>
      <div class="p-4 mx-auto w-full md:w-3/5 text-center">
        <div>WARNING : THIS ARTICLE CONTAINS MATERIAL WHICH MAY OFFEND AND MAY NOT BE DISTRIBUTED, CIRCULATED, SOLD, HIRED, GIVEN, LENT, SHOWN, PLAYED OR PROJECTED TO A PERSON UNDER THE AGE OF 18 YEARS</div>
        <div>警告：本物品內容可能令人反感，不可將本物品派發、傳閱、出售、出租、交給或出借予年齡未滿18歲的人士或將本物品向該等人士出示、播放或放映。</div>
      </div>
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">

import {useShowAgeRestrictedContent, useShowAgeRestrictedModal} from "~/composables/states";

const showAgeRestrictedModal = useShowAgeRestrictedModal();
const showAgeRestrictedContent = useShowAgeRestrictedContent();

</script>
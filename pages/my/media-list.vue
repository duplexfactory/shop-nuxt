<template>
  <div v-if="!mediaPending">
    <div class="flex justify-between mb-4">
      <button v-if="cursors && cursors.before"
              @click="clickPrevPage"
              class="hover:underline text-pink-600">
        上一頁
      </button>
      <span v-else></span>

      <button v-if="cursors && cursors.after"
              @click="clickNextPage"
              class="hover:underline text-pink-600">
        下一頁
      </button>
      <span v-else></span>
    </div>
    <div class="table mb-8">
      <div class="table-header-group">
        <div class="table-row">
          <div class="table-cell">相片</div>
          <div class="table-cell">描述</div>
          <div class="table-cell">價錢</div>
          <div class="table-cell">
            接受訂單
            <Popper hover offsetDistance="0" placement="top">
              <span>i</span>
              <template #content>
                <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">開啓接受訂單後，客戶可以直接下單購買產品。</div>
              </template>
            </Popper>
          </div>
          <div class="table-cell">
            自訂價錢
            <Popper hover offsetDistance="0" placement="top">
              <span>i</span>
              <template #content>
                <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">
                  開啓後，客戶下單購買時可以自由輸入價格。客戶下單後需待你確認價格才付款。適用於訂製產品。
                </div>
              </template>
            </Popper>
          </div>
          <div class="table-cell">折扣</div>
        </div>
      </div>

      <!--    <template v-if="!commerceDataPending">-->
      <!--      {{ commerceData }}-->
      <LazyMediaTableRow v-for="media in medias"
                         :key="media.code"
                         :media="media"
                         v-model:mediaCommerceData="commerceData[media.code]">
      </LazyMediaTableRow>
      <!--    </template>-->
    </div>
  </div>
</template>

<script lang="ts" setup>

import Popper from "vue3-popper";

import useMediaList from "~/composables/useMediaList";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import IgMedia from "~/models/IgMedia";

const {
  mediaPending,
  medias,
  cursors,
  fetchOwnOfficialMedias
} = useMediaList();

// const commerceDataPending = ref(true)
const commerceData = ref<Record<string, IgMediaCommerceData>>({})

onMounted(async () => {
  await fetchOwnOfficialMedias()
  for (const m of medias.value)
    commerceData.value[m.code] = null
  // commerceDataPending.value = false
})

async function clickPrevPage() {
  await fetchOwnOfficialMedias(true);
}

async function clickNextPage() {
  await fetchOwnOfficialMedias();
}

</script>

<style scoped>

.table, .table-cell {
  border-collapse: collapse;
  @apply border;
}

.table-cell {
  @apply align-middle p-2;
}

</style>

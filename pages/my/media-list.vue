<template>
  <div v-if="!mediaPending" class="table">
    <div class="table-header-group">
      <div class="table-row">
        <div class="table-cell">相片</div>
        <div class="table-cell">描述</div>
        <div class="table-cell">價錢</div>
        <div class="table-cell">
          接受訂單
          <Popper hover offsetDistance="0" placement="top">
<!--            <i class="spr-"></i>-->
            <span>i</span>
            <template #content>
              <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">開啓接受訂單後，客戶可以直接下單購買產品。</div>
            </template>
          </Popper>
        </div>
        <div class="table-cell">
          自訂價錢
          <Popper hover offsetDistance="0" placement="top">
            <!--            <i class="spr-"></i>-->
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


    <div v-for="media in medias" :key="media.code" class="table-row">
      <div class="table-cell">
        <div class="image-container aspect-square rounded-md overflow-hidden"
             style="width: 90px"
             v-lazy:background-image="media.mediaUrl || $imageUrl(media.code)"></div>
      </div>
      <div class="table-cell align-top text-sm whitespace-pre-wrap break-words overflow-hidden">
        <div class="line-clamp-7">
          {{ media.caption }}
        </div>
      </div>
      <div class="table-cell align-top">
<!--        {{ media.price }}-->

<!--        <input size="1"-->
<!--               v-model.number=""-->
<!--               class="text-input-primary"-->
<!--               type="number"/>-->
      </div>
      <div class="table-cell align-top">


      </div>
      <div class="table-cell align-top">


      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

import Popper from "vue3-popper";

import useMediaList from "~/composables/useMediaList";

const {
  mediaPending,
  medias,
  fetchOwnOfficialMedias
} = useMediaList();

onMounted(() => {
  fetchOwnOfficialMedias()
})

const price = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

</script>

<style scoped>

</style>
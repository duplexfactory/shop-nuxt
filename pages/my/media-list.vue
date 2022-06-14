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
            i
            <i class="spr-"></i>
            <template #content>
              <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">此價格由電腦偵查或用戶提出。如有錯漏，歡迎提出修改。</div>
            </template>
          </Popper>
        </div>
        <div class="table-cell">
          自訂價錢
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
<!--               v-model=""-->
<!--               class="text-input-primary"-->
<!--               type="text"/>-->
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
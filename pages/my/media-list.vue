<template>
  <div class="mb-8">
    <div v-if="isPageCommerceSet" class="mb-4">
      <input type="checkbox" id="only-active" name="onlyActive" v-model="onlyActiveFilter">
      <label for="only-active" class="pl-2">只顯示接受訂單的貼文</label>
    </div>

    <div class="flex justify-between">
      <button v-if="prevPageAvailable"
              @click="clickPrevPage"
              class="hover:underline text-pink-600">
        上一頁
      </button>
      <span v-else></span>

      <button v-if="nextPageAvailable"
              @click="clickNextPage"
              class="hover:underline text-pink-600">
        下一頁
      </button>
      <span v-else></span>
    </div>

    <div v-if="!mediaPending" class="wrapper my-4">
      <div class="table">
        <div class="table-header-group">
          <div class="table-row">
            <div class="table-cell" style="width: 1%; white-space: nowrap;">相片</div>
            <div class="table-cell" style="min-width: 180px;">描述</div>
            <div class="table-cell">價錢</div>
            <div v-if="isPageCommerceSet" class="table-cell whitespace-nowrap">
              接受訂單
              <client-only>
                <Popper hover offsetDistance="0" placement="top">
                  <i class="spr-info-circled-alt text-gray-600"></i>
                  <template #content>
                    <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">開啓接受訂單後，客戶可以直接下單購買產品。</div>
                  </template>
                </Popper>
              </client-only>
            </div>
<!--            <div class="table-cell whitespace-nowrap">-->
<!--              自訂價錢-->
<!--              <Popper hover offsetDistance="0" placement="top">-->
<!--                <i class="spr-info-circled-alt text-gray-600"></i>-->
<!--                <template #content>-->
<!--                  <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">-->
<!--                    開啓後，客戶下單購買時可以自由輸入價格。客戶下單後需待你確認價格才付款。適用於訂製產品。-->
<!--                  </div>-->
<!--                </template>-->
<!--              </Popper>-->
<!--            </div>-->
            <div v-if="isPageCommerceSet" class="table-cell">折扣</div>
            <div class="table-cell">動作</div>
          </div>
        </div>

        <LazyMediaTableRow v-for="media in currentMedias"
                           :key="media.code"
                           :media="media"
                           :commerceEditable="isPageCommerceSet"
                           @showConfirmToggleActive="showConfirmToggleActive"
                           v-model:mediaCommerceData="commerceData[media.code]">
        </LazyMediaTableRow>

      </div>
    </div>

    <div class="flex justify-between">
      <button v-if="prevPageAvailable"
              @click="clickPrevPage"
              class="hover:underline text-pink-600">
        上一頁
      </button>
      <span v-else></span>

      <button v-if="nextPageAvailable"
              @click="clickNextPage"
              class="hover:underline text-pink-600">
        下一頁
      </button>
      <span v-else></span>
    </div>

    <transition name="modal">
      <LazyConfirmModal v-if="showConfirmToggleActiveModal"
                        cancelButtonTitle="取消"
                        confirmButtonTitle="確定"
                        @close="cancelToggleActive"
                        @confirm="confirmToggleActive">
        <template #body>
          <div class="p-4">
            <div>你是否確定開啓接受訂單？</div>
            <div>開啓後，客戶可直接在Shoperuse向你下單購買產品。</div>
            <div class="mt-2">
              <input type="checkbox" id="no-more" name="no-more" v-model="noMoreToggleActiveReminder" class="mr-2">
              <label for="no-more">下次不再顯示</label>
            </div>
          </div>
        </template>
      </LazyConfirmModal>
    </transition>

  </div>
</template>

<script lang="ts" setup>

import Popper from "vue3-popper";
import {mediaPrice} from  "~/utils/mediaPrice"
import useMediaList from "~/composables/useMediaList";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";
import Dict = NodeJS.Dict;
import IgMedia from "~/models/IgMedia";

const nuxt = useNuxtApp()
const {getAuthHeader, headersToObject} = useAuth()
const igPageId = useIgPageId()

const isPageCommerceSet = ref(false)
async function checkIsPageCommerceSet() {
  const {
    data: pageCommerceRawData,
    pending: pageCommercePending,
    error: pageCommerceDataError
  } = await useContentKeyedLazyFetch(`/api/shop/id/${igPageId.value}/commerce-data`)
  watch(pageCommercePending, () => {
    isPageCommerceSet.value = !pageCommerceDataError.value
  }, {immediate: true})
}

watch(igPageId, checkIsPageCommerceSet, {immediate: true})

const {
  mediaPending,
  medias,
  limit,
  cursors,
  fetchOwnOfficialMedias
} = useMediaList()

// Only active filter.
const onlyActiveFilter = ref(false)
const allOnlyActiveMedias = ref<IgMedia[]>([])
const currentPage = ref(1)
const commerceData = ref<Record<string, IgMediaCommerceData>>({})

const currentMedias = computed(() => {
  if (onlyActiveFilter.value) {
    // Fake pagination.
    const startIndex = (currentPage.value - 1) * limit.value
    return allOnlyActiveMedias.value.slice(startIndex, startIndex + limit.value)
  }
  else {
    return medias.value
  }
})

watch(onlyActiveFilter, async () => {
  if (onlyActiveFilter.value) {
    // Reset pages.
    currentPage.value = 1

    // Get all commerce data of medias that are active.
    const {data} = await $fetch('/api/media/commerce-data', {
      params: {
        active: true,
        pageId: igPageId.value
      }
    })

    const codes = Object.keys(data)
    if (codes.length === 0) {
      allOnlyActiveMedias.value = []
      return
    }

    Object.assign(commerceData.value, data)

    // Get the medias of these commerce data.
    const mediaData = await $fetch("/api/media", {
      params: {
        codes: codes.join(",")
      }
    })
    if (!!mediaData) {
      const medias: IgMedia[] = Object.values(mediaData.medias)
      allOnlyActiveMedias.value = medias.sort((a, b) => b.takenAt - a.takenAt)
    }
  }
  else {
    // Reset pages.
    cursors.value = null
    await clickNextPage()
  }
})

async function fetchMediaCommerceData() {
  const data = await $fetch('/api/media/commerce-data', {
    params: {
      codes: medias.value.filter((m) => !Object.keys(commerceData.value).includes(m.code)).map((m) => m.code).join(',')
    }
  })
  Object.assign(commerceData.value, data.data)
}

onMounted(async () => {
  await clickNextPage()
})

// Prev and next page.
const prevPageAvailable = computed(() => {
  if (onlyActiveFilter.value) {
    return currentPage.value !== 1
  }
  else {
    return cursors.value && cursors.value.before
  }
})

const nextPageAvailable = computed(() => {
  if (onlyActiveFilter.value) {
    return currentPage.value * limit.value < allOnlyActiveMedias.value.length
  }
  else {
    return cursors.value && cursors.value.after
  }
})

async function clickPrevPage() {
  if (onlyActiveFilter.value) {
    currentPage.value --
  }
  else {
    await fetchOwnOfficialMedias(true)
  }
}

async function clickNextPage() {
  if (onlyActiveFilter.value) {
    currentPage.value ++
  }
  else {
    await fetchOwnOfficialMedias()
    await fetchMediaCommerceData()
  }
}

const showConfirmToggleActiveModal = ref(false)
const noMoreToggleActiveReminder = ref(false)
const togglingMediaCode = ref("")
async function showConfirmToggleActive(mediaCode: string) {
  togglingMediaCode.value = mediaCode

  noMoreToggleActiveReminder.value = localStorage.getItem("no_more_toggle_active_reminder") === "true"
  if (!commerceData.value[togglingMediaCode.value].active || noMoreToggleActiveReminder.value) {
    // Turn to inactive or saved no more reminders.
    await confirmToggleActive()
    return
  }

  showConfirmToggleActiveModal.value = true
}
async function confirmToggleActive() {

  const media = medias.value.find((m) => m.code === togglingMediaCode.value)
  if (mediaPrice(media) === 0) {
    await cancelToggleActive()
    nuxt.$toast.error("請先設定價錢！");
    return
  }

  showConfirmToggleActiveModal.value = false
  try {
    await $fetch(
        `/api/media/${togglingMediaCode.value}/commerce-data/edit`,
        {
          method: 'PUT',
          headers: await getAuthHeader(),
          body: {
            active: commerceData.value[togglingMediaCode.value].active
          } as Partial<IgMediaCommerceData>
        }
    );

    localStorage.setItem("no_more_toggle_active_reminder", noMoreToggleActiveReminder.value.toString())
    togglingMediaCode.value = ""

    nuxt.$toast.success("成功！");
  }
  catch (e) {
    nuxt.$toast.error("失敗！");
  }
}
async function cancelToggleActive() {
  showConfirmToggleActiveModal.value = false
  commerceData.value[togglingMediaCode.value].active = !commerceData.value[togglingMediaCode.value].active
  togglingMediaCode.value = ""
}

</script>

<style scoped>

.wrapper {
  overflow-x: auto;
  white-space: nowrap;
}

.wrapper .table {
  width: auto;
  min-width: 100%;
}

.table, .table-cell {
  border-collapse: collapse;
  @apply border;
}

.table-cell {
  @apply align-middle p-2;
}

</style>

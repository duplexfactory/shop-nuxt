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
          <div class="table-cell whitespace-nowrap">
            接受訂單
            <Popper hover offsetDistance="0" placement="top">
              <i class="spr-info-circled-alt text-gray-600"></i>
              <template #content>
                <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">開啓接受訂單後，客戶可以直接下單購買產品。</div>
              </template>
            </Popper>
          </div>
          <div class="table-cell whitespace-nowrap">
            自訂價錢
            <Popper hover offsetDistance="0" placement="top">
              <i class="spr-info-circled-alt text-gray-600"></i>
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
                         @showConfirmToggleActive="showConfirmToggleActive"
                         v-model:mediaCommerceData="commerceData[media.code]">
      </LazyMediaTableRow>
      <!--    </template>-->
    </div>

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

    <Teleport to="body">
      <transition name="modal">
        <LazyConfirmModal v-if="togglingMediaCode"
                          cancelButtonTitle="取消"
                          confirmButtonTitle="確定"
                          @close="cancelToggleActive"
                          @confirm="confirmToggleActive">
          <template #body>
            <div class="p-4">
              <div>你是否確定開啓接受訂單？</div>
              <div>開啓後，客戶可直接在Shoperuse向你下單購買產品。</div>
            </div>
          </template>
        </LazyConfirmModal>
      </transition>
    </Teleport>

  </div>
</template>

<script lang="ts" setup>

import Popper from "vue3-popper";

import useMediaList from "~/composables/useMediaList";
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData";

const {
  mediaPending,
  medias,
  cursors,
  fetchOwnOfficialMedias
} = useMediaList()
const nuxt = useNuxtApp()
const {getAuthHeader, headersToObject} = useAuth()

// const commerceDataPending = ref(true)
const commerceData = ref<Record<string, IgMediaCommerceData>>({})

onMounted(async () => {
  await fetchOwnOfficialMedias()
  const {data, error} = await useFetch('/api/media/commerce-data', {
    params: {
      ids: medias.value.map((m) => m.code).join(',')
    }
  })

  for (const m of medias.value)
    commerceData.value[m.code] = data.value["data"][m.code]
// commerceDataPending.value = false
})

async function clickPrevPage() {
  await fetchOwnOfficialMedias(true)
}

async function clickNextPage() {
  await fetchOwnOfficialMedias()
}

const showConfirmToggleActiveModal = ref(false)
const togglingMediaCode = ref("")
function showConfirmToggleActive(mediaCode: string) {
  showConfirmToggleActiveModal.value = true
  togglingMediaCode.value = mediaCode
}
async function confirmToggleActive() {
  showConfirmToggleActiveModal.value = false
  try {
    await useFetch(
        `/api/media/${togglingMediaCode.value}/commerce-data/edit`,
        {
          method: 'PUT',
          headers: headersToObject(await getAuthHeader()),
          body: {
            active: commerceData.value[togglingMediaCode.value].active
          } as Partial<IgMediaCommerceData>
        }
    );

    nuxt.vueApp.$toast.success("成功！", {position: "top"});
    togglingMediaCode.value = ""

  }
  catch (e) {
    nuxt.vueApp.$toast.error("失敗！", {position: "top"});
  }
}
async function cancelToggleActive() {
  showConfirmToggleActiveModal.value = false
  commerceData.value[togglingMediaCode.value].active = !commerceData.value[togglingMediaCode.value].active
  togglingMediaCode.value = ""
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

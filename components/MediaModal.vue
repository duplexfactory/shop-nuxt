<template>
  <LazyModal class="text-gray-800" @close="close">
    <template #body>
      <div class="md:grid grid-cols-8 gap-8 pb-8 px-4">
        <div class="col-span-4">
          <template v-if="localPage">
            <template v-if="localPage.igConnected && localMedia">
              <div class="image-container aspect-square rounded-md overflow-hidden"
                   v-lazy:background-image="localMedia.mediaUrl || $imageUrl(localMedia.code, 'l')"></div>
              <div class="mt-2 hidden md:block text-sm whitespace-pre-wrap break-words">
                {{ stripTrailingHashtags(localMedia.caption) }}
              </div>
            </template>
            <MediaCardIGEmbed v-if="!localPage.igConnected && localMediaCode"
                              captioned
                              :post-id="localMediaCode"
                              :fixed-aspect-ratio="0"
                              :username="localPage.username"></MediaCardIGEmbed>
          </template>
        </div>
        <div class="col-span-4">
          <div class="mt-4 md:mt-0">

            <div class="flex items-baseline">
              <div class="text-xl md:text-2xl text-pink-700 font-semibold">{{
                  formatMediaPrice(mediaPrice(localMedia))
                }}
              </div>

              <Popper hover offsetDistance="0" placement="top">
                <button @click="showPriceSuggestionModal = true"
                        class="ml-2 text-sm text-gray-500 underline decoration-dotted">提出修改
                </button>
                <template #content>
                  <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">此價格由電腦偵查或用戶提出。如有錯漏，歡迎提出修改。</div>
                </template>
              </Popper>
            </div>

            <DiscountCard v-if="!!mediaCommerceData && !!(mediaCommerceData.discount)"
                          class="mt-2"
                          defaultTitle="產品優惠"
                          discountTextPrefix="此產品買"
                          :discount="mediaCommerceData.discount"></DiscountCard>
            <DiscountCard v-if="!!pageCommerceData && !!(pageCommerceData.discount)"
                          class="mt-2"
                          defaultTitle="店鋪優惠"
                          discountTextPrefix="全店買"
                          :discount="pageCommerceData.discount"></DiscountCard>

            <div v-if="mediaCommerceDataLoaded" class="mt-2">
              <template v-if="!!mediaCommerceData && mediaCommerceData.active">
                <div class="flex items-center">
                  <div class="mr-4 text-gray-600">數量</div>
                  <QuantityInput v-model.number="quantity"></QuantityInput>
                </div>

                <button class="btn-primary w-full mt-2" @click="clickBuyNow">
                  立即購買
                </button>
                <button class="btn-outline w-full mt-2" @click="clickAddToCart">
                  加到購物車
                </button>
              </template>
              <button v-else-if="!pageCommerceData" class="btn btn-primary w-full" @click="clickContactShop">
                聯絡店主下單
              </button>
            </div>

            <hr class="my-4"/>

            <div v-if="localPage" class="flex items-center">
              <template v-if="localPage.igConnected">
                <div class="rounded-full overflow-hidden image-container aspect-square mr-2"
                     style="height: 50px;">
                  <img class="h-full w-full"
                       :alt="localPage.username"
                       v-lazy="localPage.profilePicUrl"/>
                </div>
                <div>
                  <nuxt-link class="hover:underline" :to="`/shop/${localPage.username}`" @click="close">
                    {{ localPage.username }}
                  </nuxt-link>
                  <div class="text-gray-500 text-sm">
                    {{ localPage.fullName }}
                  </div>
                </div>
              </template>
              <template v-else>
                <nuxt-link class="hover:underline" :to="`/shop/${localPage.username}`" @click="close">
                  {{ localPage.username }}
                </nuxt-link>
              </template>
            </div>

            <hr class="my-4"/>

            <!--            <div v-if="contactInfoRows.length !== 0" class="text-gray-500 text-xs mt-2">-->
            <!--              <div v-for="(pageInfoRow, i) in contactInfoRows" :key="pageInfoRow.value + i.toString()" class="mb-1">-->
            <!--                <i class="mr-2" :class="pageInfoRow.iconClass"></i>-->
            <!--                <component :is="pageInfoRow.link ? 'a' : 'span'"-->
            <!--                           class="break-words"-->
            <!--                           :class="{'hover:underline': pageInfoRow.link}"-->
            <!--                           target="_blank"-->
            <!--                           :href="pageInfoRow.link">{{ pageInfoRow.value }}</component>-->
            <!--              </div>-->
            <!--            </div>-->

            <div v-if="localMediaCode && localPage && localPage.igConnected"
                 class="mt-4 md:hidden text-sm whitespace-pre-wrap break-words">
              {{ stripTrailingHashtags(localMedia.caption) }}
            </div>

            <template v-if="localPage && !(localPage.igConnected)">
              <div class="text-gray-400 mt-4 text-xs"><i>圖片、文字、資料來源: IG @ <a class="hover:underline"
                                                                             :href="`https://www.instagram.com/${localPage.username}/`"
                                                                             target="_blank">{{
                  localPage.username
                }}</a></i></div>
              <div class="text-gray-400 text-xs"><i>資料並沒有核實，或有錯漏，僅供參考。</i></div>
            </template>


            <div class="flex items-center mt-4">
              <div class="text-xl md:text-2xl">評論</div>
              <button @click="isShowingCreateReview = true" class="ml-2 btn btn-sm btn-outline">撰寫評論</button>
            </div>

            <!-- Create Review -->
            <ReviewCreateCard v-model:show="isShowingCreateReview" isCollapsible v-model:rating="rating"
                              v-model:content="content" :isCreatingReview="isCreatingReview"
                              @create-review="sendReview()"></ReviewCreateCard>

            <!-- Reviews -->
            <template v-for="review in reviews">
              <ReviewCard :review="review"></ReviewCard>
              <hr/>
            </template>

            <!-- No Reviews -->
            <div v-if="reviews.length == 0" class="mt-2 p-6 bg-gray-100 rounded-md text-lg text-center">
              暫時沒有任何評論
            </div>

          </div>
        </div>
      </div>

      <Teleport to="body">
        <transition name="modal">
          <LazyModal v-if="showPriceSuggestionModal" @close="showPriceSuggestionModal = false">
            <template #container>
              <div class="bg-white p-4 rounded-md">
                <input v-model="suggestedPrice" class="block text-input-primary" type="number" name="price"
                       placeholder="輸入價格">
                <div class="flex justify-end mt-2">
                  <button @click="submitPrice" class="btn-primary btn-sm mr-2">提交</button>
                  <button @click="showPriceSuggestionModal = false" class="btn-outline btn-sm">取消</button>
                </div>
              </div>
            </template>
          </LazyModal>
        </transition>
      </Teleport>


      <Teleport to="body">
        <transition :duration="500" name="modal">
          <LazyModal v-if="showContactModal" @close="showContactModal = false">
            <template #container>
              <div class="flex items-end h-full w-full" @click="showContactModal = false">

                <div v-if="contactInfoRows.length !== 0"
                     @click.stop=""
                     class="inner-sheet bg-white p-4 rounded-t-md w-full text-gray-500">
                  <button v-for="(pageInfoRow, i) in contactInfoRows"
                          :key="pageInfoRow.value + i.toString()"
                          @click="clickContactInfoRow(pageInfoRow)"
                          class="py-2 block">
                    <i class="mr-2" :class="pageInfoRow.iconClass"></i>
                    <span class="break-words">{{ pageInfoRow.value }}</span>
                  </button>
                </div>

              </div>
            </template>
          </LazyModal>
        </transition>
      </Teleport>

    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import IgPageReview from "~/models/IgPageReview"

import {computed} from "@vue/reactivity"
import PageInfoRow from "~/models/PageInfoRow"

import Popper from "vue3-popper"
import type {Ref} from "vue"
import IgMedia from "~/models/IgMedia"
import IgPage from "~/models/IgPage"
import IgPageExtraData from "~/models/IgPageExtraData"
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData"
import {IgPageCommerceData} from "~/models/IgPageCommerceData"

import { hash } from 'ohash'

const nuxt = useNuxtApp()
const router = useRouter()

// Media Modal
const showMediaModal = useShowMediaModal()
const showingMediaModalData = useShowingMediaModalData()

const fetchedPage = ref(null)
const localPage = computed<IgPage>(() => {
  return showingMediaModalData.value.simplePage || fetchedPage.value
})

const localMediaCode = computed(() => {
  return showingMediaModalData.value.media?.code || showingMediaModalData.value.code
})
const fetchedMedia: Ref<IgMedia | null> = ref(null)
const localMedia = computed(() => {
  return showingMediaModalData.value.media || fetchedMedia.value
})

function stripTrailingHashtags(s: string): string {
  return s.replace(/(?:[\n\r\s]*[#][^\n\r\s]+)+[\n\r\s]*$/i, "")
}

// Media Price
const {mediaPrice, formatMediaPrice} = useMediaPrice()

// Create Review
const {
  reviewingCode,
  reviewingPageId,
  isCreatingReview,
  rating,
  content,
  createReview,
  resetCreateReview
} = useCreateReview()
const isShowingCreateReview = ref<boolean>(false)
reviewingCode.value = localMediaCode.value
reviewingPageId.value = showingMediaModalData.value.simplePage?._id || showingMediaModalData.value.pageId

const reviews = ref<IgPageReview[]>([])

async function fetchReviews() {
  reviews.value = (await $fetch('/api/reviews', {
    method: 'GET', params: {
      mediaCode: localMediaCode.value,
    }
  }))['reviews']
}

async function sendReview() {
  await createReview()
  isShowingCreateReview.value = false
  await fetchReviews()
}

function close() {
  resetCreateReview()
  isShowingCreateReview.value = false
  reviews.value = []

  showMediaModal.value = false
}

function onUsernameClick() {
  router.push(`/shop/${localPage.value.username}`)
  close()
}

const screenSize = useScreenSize()

// Suggest price
const showPriceSuggestionModal = ref(false)
const suggestedPrice = ref(null)

async function submitPrice() {
  if (suggestedPrice.value === null) {
    nuxt.$toast.error("請輸入價格！")
    return
  }

  const body: any = {
    code: localMediaCode.value,
    price: suggestedPrice.value
  }
  await $fetch('/api/suggest/media-price', {method: 'POST', body})

  // Reset
  suggestedPrice.value = null

  nuxt.$toast.success("已成功提交，感謝你的建議，我們將儘快處理。")
  showPriceSuggestionModal.value = false
}

// Contact
const showContactModal = ref(false)

function clickContactShop() {
  if (contactInfoRows.value.length === 0) {
    // Force open IG page if no contact info available.
    window.open(`https://www.instagram.com/${localPage.value.username}/`, '_blank').focus()
  } else {
    showContactModal.value = true
  }
}

type ContactInfoRow = {
  key: keyof IgPageExtraData | string;
  iconClass: string;
  value: string;
  link?: string;
};

const contactInfoRows = computed(() => {
  if (!localPage.value) return [] as ContactInfoRow[]

  const fields: (keyof IgPageExtraData)[] = ["whatsapp", "wechat", "signal"]
  if (!localPage.value.extraData || !localPage.value.extraData.noPhoneCall) {
    fields.unshift("phone")
  }

  const rows: ContactInfoRow[] = PageInfoRow.rowsFromExtraData(localPage.value.extraData, fields)
  if (!localPage.value.extraData || !localPage.value.extraData.noIgDM) {
    rows.unshift({
      key: "igPage",
      iconClass: "spr-instagram",
      value: localPage.value.username,
      link: `https://www.instagram.com/${localPage.value.username}/`
    })
  }
  return rows
})

function clickContactInfoRow(row: ContactInfoRow) {
  if (!!row.link) {
    window.open(row.link, '_blank').focus()
  } else if (row.key === "phone") {
    window.open(`tel:${row.value}`, '_self')
  } else {
    navigator.clipboard.writeText(row.value)
    nuxt.$toast.success("已複製至剪貼簿！")
  }
}

// Commerce
const mediaCommerceData: Ref<IgMediaCommerceData | null> = ref(null)
const mediaCommerceDataLoaded = ref(false)
const pageCommerceData: Ref<IgPageCommerceData | null> = ref(null)
const pageCommerceDataLoaded = ref(false)

// Create order
const quantity = ref(1)

function clickBuyNow() {
  addToCart()
  close()
  router.push(`/cart`)
}

function clickAddToCart() {
  addToCart()
  nuxt.$toast.success("已成功加至購物車。")
}

function addToCart() {
  let cart: { code: string, quantity: number }[] = (JSON.parse(localStorage.getItem("cart")) as []) || []
  const item = cart.find((i) => i.code === localMediaCode.value)
  if (!!item) {
    item.quantity += quantity.value
  } else {
    cart.push({
      code: localMediaCode.value,
      quantity: quantity.value
    })
  }
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Mounted
onMounted(async () => {

  // Init data on modal open
  if (!localMedia.value) {
    const {data, pending} = await useContentKeyedFetch(`/api/media/${localMediaCode.value}`)
    fetchedMedia.value = data.value.media
  }

  if (!localPage.value) {
    const {data, error} = await useContentKeyedFetch(`/api/shop/id/${showingMediaModalData.value.pageId}`)
    if (!error.value) {
      fetchedPage.value = data.value.page
    }
  }

  await fetchReviews()

  const {
    data: mediaCommerceDataRaw,
    error: mediaCommerceDataError
  } = await useContentKeyedFetch('/api/media/commerce-data', {
    params: {
      codes: localMedia.value.code
    }
  })
  if (!mediaCommerceDataError.value) {
    mediaCommerceData.value = mediaCommerceDataRaw.value.data[localMedia.value.code] || null
  }
  mediaCommerceDataLoaded.value = true

  const {
    data: pageCommerceDataRaw,
    error: pageCommerceDataError
  } = await useContentKeyedFetch(`/api/shop/id/${localPage.value._id}/commerce-data`)
  if (!!pageCommerceDataRaw.value) {
    pageCommerceData.value = pageCommerceDataRaw.value.commerceData
  }
  pageCommerceDataLoaded.value = true

})

</script>

<style scoped>

.modal-enter-active .inner-sheet,
.modal-leave-active .inner-sheet {
  transition: all 0.25s ease;
}

.modal-enter-active .inner-sheet {
  transition-delay: 0.25s;
}

.modal-enter-from .inner-sheet,
.modal-leave-to .inner-sheet {
  transform: translateY(100%);
}
</style>

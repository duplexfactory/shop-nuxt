<template>
  <div class="md:grid grid-cols-8 gap-8">
    <div class="col-span-4">
      <template v-if="page">
        <template v-if="page.igConnected && media">

          <div v-if="media.mediaType === 'VIDEO'" class="image-container rounded-md overflow-hidden" style="background-color: #000 !important;">
            <video controls preload="metadata">
              <source :src="media.mediaUrl" type="video/mp4">
              <source :src="media.mediaUrl" type="video/ogg">
              Your browser does not support the video tag.
            </video>
          </div>
          <div v-else-if="media.mediaType === 'IMAGE'" class="image-container aspect-square rounded-md overflow-hidden"
               v-lazy:background-image="media.mediaUrl || $imageUrl(media.code, 'l')"></div>
          <template v-else-if="media.mediaType === 'CAROUSEL_ALBUM'">
            <div class="image-container aspect-square rounded-md overflow-hidden"
                 v-lazy:background-image="media.mediaList[carouselIndex]"></div>
            <div class="grid grid-cols-6 lg:grid-cols-8 gap-2 mt-2">
              <div v-for="(m, i) in media.mediaList"
                   :key="m"
                   class="col-span-1">
                <div class="image-container image-container-clickable aspect-square cursor-pointer rounded-md overflow-hidden w-full"
                     :class="{'border-2 border-pink-400': carouselIndex === i}"
                     @click="carouselIndex = i"
                     v-lazy:background-image="m"></div>
              </div>
            </div>
          </template>

          <div class="mt-2 hidden md:block text-sm whitespace-pre-wrap break-words">
            {{ stripTrailingHashtags(media.caption) }}
          </div>
        </template>
        <MediaCardIGEmbed v-if="!page.igConnected && media.code"
                          captioned
                          :post-id="media.code"
                          :fixed-aspect-ratio="0"
                          :username="page.username"></MediaCardIGEmbed>
      </template>
    </div>
    <div class="col-span-4">
      <div class="mt-4 md:mt-0">

        <div class="flex items-baseline">
          <div class="text-xl md:text-2xl text-pink-700 font-semibold">{{
              formatMediaPrice(mediaPrice(media))
            }}
          </div>

          <client-only>
            <Popper v-if="!(!!mediaCommerceData && mediaCommerceData.active)" hover offsetDistance="0" placement="top">
              <button @click="showPriceSuggestionModal = true"
                      class="ml-2 text-sm text-gray-500 underline decoration-dotted">提出修改
              </button>
              <template #content>
                <div class="bg-gray-900/80 text-white text-sm p-2 rounded-md">此價格由電腦偵查或用戶提出。如有錯漏，歡迎提出修改。</div>
              </template>
            </Popper>
          </client-only>
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

        <div v-if="page" class="flex items-center">
          <template v-if="page.igConnected">
            <div class="rounded-full overflow-hidden image-container aspect-square mr-2"
                 style="height: 50px;">
              <img class="h-full w-full"
                   :alt="page.username"
                   v-lazy="page.profilePicUrl"/>
            </div>
            <div>
              <nuxt-link class="hover:underline" :to="`/shop/${page.username}`">
                {{ page.username }}
              </nuxt-link>
              <div class="text-gray-500 text-sm">
                {{ page.fullName }}
              </div>
            </div>
          </template>
          <template v-else>
            <nuxt-link class="hover:underline" :to="`/shop/${page.username}`">
              {{ page.username }}
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

        <div v-if="media.code && page && page.igConnected"
             class="mt-4 md:hidden text-sm whitespace-pre-wrap break-words">
          {{ stripTrailingHashtags(media.caption) }}
        </div>

        <template v-if="page && !(page.igConnected)">
          <div class="text-gray-400 mt-4 text-xs"><i>圖片、文字、資料來源: IG @ <a class="hover:underline"
                                                                         :href="`https://www.instagram.com/${page.username}/`"
                                                                         target="_blank">{{
              page.username
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
  </div>
</template>

<script lang="ts" setup>

import IgPageReview from "~/models/IgPageReview"

import {computed} from "@vue/reactivity"
import PageInfoRow from "~/models/PageInfoRow"

import Popper from "vue3-popper"
import type {PropType, Ref} from "vue"
import IgMedia from "~/models/IgMedia"
import IgPage from "~/models/IgPage"
import IgPageExtraData from "~/models/IgPageExtraData"
import {IgMediaCommerceData} from "~/models/IgMediaCommerceData"
import {IgPageCommerceData} from "~/models/IgPageCommerceData"
import {isIGVideoUrl} from "~/utils/imageUrl";

// import {mediaPrice, formatMediaPrice} from "~/utils/mediaPrice";
import {SimpleIgPage} from "~/models/SimpleIgPage";
import {onMounted, ref} from "vue"
import {useNuxtApp, useRouter} from "#app"
import useContentKeyedFetch from "~/composables/useContentKeyedFetch"
import useMediaPrice from "~/composables/useMediaPrice"
import {useScreenSize} from "~/composables/states"

const nuxt = useNuxtApp()
const router = useRouter()

const {
  mediaPrice,
  formatMediaPrice
} = useMediaPrice()

const props = defineProps({
  media: Object as PropType<IgMedia>,
  page: Object as PropType<SimpleIgPage>,
})
const {media, page} = toRefs(props)

if(media.value.mediaId && page.value.igConnected) {
  const { data } = await useContentKeyedFetch(`/api/media/official/${page.value._id}/${media.value.mediaId}`);
  Object.assign(media.value, data.media)
}

function stripTrailingHashtags(s: string): string {
  return s.replace(/(?:[\n\r\s]*[#][^\n\r\s]+)+[\n\r\s]*$/i, "")
}

// Carousel Post
const carouselIndex = ref(0)

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
reviewingCode.value = media.value.code
reviewingPageId.value = page.value._id

const reviews = ref<IgPageReview[]>([])

async function fetchReviews() {
  reviews.value = (await $fetch('/api/reviews', {
    params: {
      mediaCode: media.value.code,
    }
  })).reviews
}

async function sendReview() {
  await createReview()
  isShowingCreateReview.value = false
  await fetchReviews()
}

function onUsernameClick() {
  router.push(`/shop/${page.value.username}`)
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
    code: media.value.code,
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
    window.open(`https://www.instagram.com/${page.value.username}/`, '_blank').focus()
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
  if (!page.value) return [] as ContactInfoRow[]

  const fields: (keyof IgPageExtraData)[] = ["whatsapp", "wechat", "signal"]
  if (!page.value.extraData || !page.value.extraData.noPhoneCall) {
    fields.unshift("phone")
  }

  const rows: ContactInfoRow[] = PageInfoRow.rowsFromExtraData(page.value.extraData, fields)
  if (!page.value.extraData || !page.value.extraData.noIgDM) {
    rows.unshift({
      key: "igPage",
      iconClass: "spr-instagram",
      value: page.value.username,
      link: `https://www.instagram.com/${page.value.username}/`
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
  router.push(`/cart`)
}

function clickAddToCart() {
  addToCart()
  nuxt.$toast.success("已成功加至購物車。")
}

function addToCart() {
  let cart: { code: string, quantity: number }[] = (JSON.parse(localStorage.getItem("cart")) as []) || []
  const item = cart.find((i) => i.code === media.value.code)
  if (!!item) {
    item.quantity += quantity.value
  } else {
    cart.push({
      code: media.value.code,
      quantity: quantity.value
    })
  }
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Mounted
onMounted(async () => {
  await fetchReviews()

  const {
    data: mediaCommerceDataRaw,
    error: mediaCommerceDataError
  } = await useContentKeyedFetch('/api/media/commerce-data', {
    params: {
      codes: media.value.code
    }
  })
  if (!mediaCommerceDataError.value) {
    mediaCommerceData.value = mediaCommerceDataRaw.value.data[media.value.code] || null
  }
  mediaCommerceDataLoaded.value = true

  const {
    data: pageCommerceDataRaw,
    error: pageCommerceDataError
  } = await useContentKeyedFetch(`/api/shop/id/${page.value._id}/commerce-data`)
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

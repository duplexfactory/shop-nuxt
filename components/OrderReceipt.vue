<template>
  <div>
    <div class="hidden md:grid grid-cols-12 gap-4 lg:gap-8 py-2 px-4 bg-gray-100">
      <div class="col-span-4 xl:col-span-5">商品</div>
      <div class="col-span-2">單件價格</div>
      <div class="col-span-3 xl:col-span-2">數量</div>
      <div class="col-span-2">小計</div>
      <div class="col-span-1"></div>
    </div>

    <div class="md:px-4">
      <template v-for="media in orderDetail.medias" :key="media.code">

        <div class="flex md:hidden pt-4" @click="openMedia(media.code)">
          <div class="image-container aspect-square rounded-md overflow-hidden flex-grow flex-shrink-0 mr-4" style="min-width:60px; max-width: 90px">
            <img v-lazy="media.mediaUrl || $imageUrl(media.code)" class="w-full h-full"/>
          </div>
          <div v-if="!!mediaDict[media.code]" class="line-clamp-4 text-sm whitespace-pre-wrap break-words">
            {{ mediaDict[media.code].caption }}
          </div>
        </div>

        <div class="col-span-2 hidden md:grid grid-cols-12 gap-4 lg:gap-8 pt-4">
          <div class="col-span-4 xl:col-span-5">
            <div class="flex cursor-pointer" @click="openMedia(media.code)">
              <div class="image-container aspect-square rounded-md overflow-hidden flex-grow flex-shrink-0 mr-4" style="min-width:60px; max-width: 90px">
                <img v-lazy="media.mediaUrl || $imageUrl(media.code)" class="w-full h-full"/>
              </div>
              <div v-if="!!mediaDict[media.code]" class="line-clamp-4 text-sm whitespace-pre-wrap break-words">
                {{ mediaDict[media.code].caption }}
              </div>
            </div>
          </div>
          <div class="col-span-2">{{ formatMediaPrice(media.price) }}</div>
          <div class="col-span-3 xl:col-span-2">
            {{ media.quantity }}
          </div>
          <div class="col-span-2">
            {{ formatMediaPrice(media.price * media.quantity - discountValue(media.discount, media.price * media.quantity, media.quantity)) }}
          </div>
          <div class="col-span-1">
            <!--              <button class="hover:underline text-red-500" @click="removeMedia(media.code)">移除</button>-->
          </div>
        </div>

        <div v-if="!!media.discount && (discountValue(media.discount, media.price, media.quantity) !== 0)"
             class="grid grid-cols-12 gap-4 lg:gap-8 pt-4">
          <div class="col-span-12 md:col-span-9">
            <div class="md:flex w-full items-center">
              <DiscountCard defaultTitle="產品優惠"
                            discountTextPrefix="此產品買"
                            singleLine
                            :discount="media.discount"
                            class="flex-1"></DiscountCard>
            </div>
          </div>
        </div>

        <div class="flex md:hidden items-center justify-between pt-4">
          <div class="flex">
            {{ "x" + media.quantity }}
<!--            <button class="hover:underline text-red-500" @click="removeMedia(media.code)">移除</button>-->
          </div>
          {{ formatMediaPrice(media.price * media.quantity - discountValue(media.discount, media.price * media.quantity, media.quantity)) }}
        </div>

        <hr class="mt-4"/>

      </template>

      <template v-if="!!orderDetail.discount && pageDiscountValue() !== 0">
        <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">
          <div class="col-span-12 md:col-span-9">
            <div class="font-semibold">店鋪優惠</div>
            <div class="md:flex w-full items-center mt-4">
              <DiscountCard defaultTitle="店鋪優惠"
                            discountTextPrefix="全店買"
                            singleLine
                            :discount="orderDetail.discount"
                            class="flex-1"></DiscountCard>
            </div>
          </div>
          <div class="col-span-12 md:col-span-3 text-right md:text-left">
            {{ "-" + formatMediaPrice(pageDiscountValue()) }}
          </div>
        </div>
        <hr/>
      </template>

      <div class="grid grid-cols-12 gap-4 lg:gap-8 py-4">
        <div class="col-span-12 md:col-span-9">

          <div class="font-semibold">郵寄方法</div>
          <div class="mt-2">
            <div class="flex items-center mt-1">
              {{ mailingTitle }}
            </div>
          </div>

          <div class="font-semibold mt-4">郵寄資料</div>
          <div>郵寄方法：{{ mailingTitle }}</div>
          <div v-for="d in mailingInfos" :key="'mailing-info-' + d.type">
            {{ d.title + '：' + d.value }}
          </div>

          <div v-if="!!orderDetail.mailingDiscount && isFreeMailing()" class="mt-4">
            <div class="font-semibold">郵寄優惠</div>
            <div class="md:flex w-full items-center mt-2">
              <div class="bg-yellow-100 px-4 py-2 rounded-md flex-1">
                <p>
                  <span class="text-gray-600">{{ orderDetail.mailingDiscount.title ?? "免郵優惠" }}</span>
                  <span class="text-gray-600 mx-2">-</span>
                  <span class="font-semibold">{{ mailingDiscountToText(orderDetail.mailingDiscount) }}</span>
                </p>
              </div>
            </div>
          </div>

        </div>
        <div class="col-span-12 md:col-span-3 text-right md:text-left">
          <template v-if="isFreeMailing()">
            免郵
          </template>
          <template v-else>
            <div v-if="orderDetail.mailing.payOnArrive">
              到付
            </div>
            <div v-if="!!orderDetail.mailing.cost">
              {{ formatMediaPrice(orderDetail.mailing.cost) }}
            </div>
          </template>
        </div>
      </div>
      <hr/>
    </div>

    <div class="grid grid-cols-12 gap-4 lg:gap-8 bg-gray-100 p-4">
      <div class="col-span-12 text-right md:(col-span-3 order-1 text-left)">
        <div class="font-semibold">
          總計
        </div>
        <div class="text-pink-700 text-xl font-semibold mt-2">
          {{ formatMediaPrice(pageTotal()) }}
        </div>
        <div v-if="!isFreeMailing() && orderDetail.mailing.payOnArrive">
          （未含到付郵費）
        </div>
      </div>
      <div class="col-span-12 md:col-span-9">
        <div>買家留言</div>
        <div>
          {{ orderDetail.note || "-" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {PropType, Ref} from "vue";
import {MailingInfoType, MailingType, OrderShopDetails} from "~/models/Order";
import {
  discountValue,
  pageTotal as _pageTotal,
  pageDiscountValue as _pageDiscountValue,
  pageFreeMailing
} from "~/utils/discountValue";
import {formatMediaPrice} from "~/utils/mediaPrice";
import {mailingDiscountToText} from "~/utils/discountText";
import {useShowingMediaModalData, useShowMediaModal} from "~/composables/states";
import {mailingInfoTypeToText, mailingTypeToText} from "~/data/commerce";
import IgMedia from "~/models/IgMedia";
import Dict = NodeJS.Dict;

const props = defineProps({
  pageId: String as PropType<string>,
  orderDetail: Object as PropType<OrderShopDetails>,
  orderCreated: Number as PropType<Number>,
})

const {
  pageId,
  orderDetail,
  orderCreated
} = toRefs(props)

// Composables.

const mediaDict: Ref<Dict<IgMedia>> = ref({})
onMounted(async () => {
  if (!orderDetail.value) {
    return
  }

  if (!!orderDetail.value.discount) {
    if (orderDetail.value.discount.deadline < orderCreated.value) {
      // Strip expired discount.
      orderDetail.value.discount = undefined
    }
    else {
      // Strip discount deadlines for UI.
      orderDetail.value.discount.deadline = undefined
    }
  }
  orderDetail.value.medias.forEach((m) => {
    if (!!m.discount) {
      if (m.discount.deadline < orderCreated.value) {
        // Strip expired discount.
        m.discount = undefined
      }
      else {
        // Strip discount deadlines for UI.
        m.discount.deadline = undefined
      }
    }
  })

  const {
    data,
    error
  } = await useContentKeyedFetch("/api/media", {
    params: {
      codes: orderDetail.value.medias.map((m) => m.code).join(",")
    }
  })
  if (!!data.value) {
    mediaDict.value = data.value.medias
  }
})

const mailingTitle = computed(() => {
  if (!orderDetail.value)
    return ""
  if (orderDetail.value.mailing.type === MailingType.OTHERS) {
    return orderDetail.value.mailing.title
  }
  return mailingTypeToText[orderDetail.value.mailing.type]
})
const mailingInfos = computed(() => {
  if (!orderDetail.value)
    return []
  const mailingInfoTypes: MailingInfoType[] = Object.keys(orderDetail.value.mailingInfo).map((t) => Number(t))
  return mailingInfoTypes.map((t) => ({
    type: t,
    title: mailingInfoTypeToText[t],
    value: orderDetail.value.mailingInfo[t]
  }))
})

function pageDiscountValue() {
  return _pageDiscountValue(orderDetail.value)
}
function isFreeMailing() {
  return pageFreeMailing(orderDetail.value)
}
function pageTotal() {
  return _pageTotal(orderDetail.value)
}

// Media interaction.
const showMediaModal = useShowMediaModal()
const showingMediaModalData = useShowingMediaModalData()
function openMedia(mediaCode: string) {
  showMediaModal.value = true;
  showingMediaModalData.value = {
    // code: mediaCode,
    media: mediaDict.value[mediaCode],
    pageId: pageId.value
  };
  mediaDict.value
}

</script>

<style scoped>

</style>
<template>
  <div v-if="(!discount.deadline || discountSecondsLeft > 0)" class="bg-yellow-100 px-4 py-2 rounded-md">
    <div v-if="singleLine">
      <p>
        <span v-if="!!discount.title || defaultTitle"
              class="text-gray-600">{{ discount.title ?? defaultTitle }}</span>
        <span class="text-gray-600 mx-2">-</span>
        <span class="font-semibold">{{ (discountTextPrefix || "") + discountToText(discount) }}</span>
      </p>
    </div>
    <template v-else>
      <div v-if="!!discount.title || defaultTitle"
           class="text-gray-600">
        {{ discount.title ?? defaultTitle }}
      </div>
      <div class="font-semibold">
        {{ (discountTextPrefix || "") + discountToText(discount) }}
      </div>
    </template>

    <div v-if="!!discount.deadline" class="flex items-baseline">
      <div class="text-sm text-gray-500 mr-2">優惠尚餘</div>
      <div>{{ countdownSecondsToText(discountSecondsLeft) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {PropType, Ref} from "vue";
import {Discount} from "~/models/Discount";
import {discountToText} from "~/utils/discountText";

const {discount, defaultTitle, discountTextPrefix, singleLine} = defineProps({
  discount: Object as PropType<Discount>,
  defaultTitle: String as PropType<String>,
  discountTextPrefix: String as PropType<String>,
  singleLine: { type: Boolean, default: false },
});

const emit = defineEmits(["deadlinePassed"])

const discountSecondsLeft = ref(0)
function countdownSecondsToText(secondsLeft: number) {
  const days = Math.floor(secondsLeft / (60 * 60 * 24))

  const secs = secondsLeft - days * (60 * 60 * 24)
  const hhmmss = new Date(secs * 1000).toISOString().substring(11, 19).split(":")

  return days.toString() + "日 " + hhmmss[0] + "時 " + hhmmss[1] + "分 " + hhmmss[2] + "秒 "
}

function configureCountdown(secondsLeft: Ref<number>, deadline: number) {
  secondsLeft.value = (deadline - Date.now()) / 1000
  if (secondsLeft.value > 0) {
    const interval = setInterval(() => {
      if (secondsLeft.value === 0) {
        clearInterval(interval)
        emit("deadlinePassed")
      } else {
        secondsLeft.value--
      }
    }, 1000)
  }
  else {
    emit("deadlinePassed")
  }
}

if (!!discount.deadline) {
  configureCountdown(discountSecondsLeft, discount.deadline)
}

</script>

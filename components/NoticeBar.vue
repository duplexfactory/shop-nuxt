<template>
  <div v-if="message" class="flex justify-between mb-4 border rounded-md px-8 py-4 bg-blue-100 border-blue-500">
    <div class="text-gray-600">
      <i class="spr-info-circled-alt mr-2"></i>{{ message }}
    </div>
    <div v-if="actionTo">
      <nuxt-link :to="actionTo">{{ actionText }}</nuxt-link>
    </div>
  </div>
</template>
<script lang="ts" setup>

const props = defineProps({
  message: {type: String, default: ""},
  actionText: {type: String, default: ""},
  actionTo: {type: String, default: ""},
})

const {
  message,
  actionText,
  actionTo
} = toRefs(props)

</script>

<style scoped>

a {
  transition: .3s;
  @apply text-gray-600 hover:text-pink-400
}

</style>

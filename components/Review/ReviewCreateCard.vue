<template>
  <div class="overflow-hidden">
    <transition name="accordion">
      <div v-if="!isCollapsible || show" class="mt-2 bg-gray-100 p-4 rounded-md">
        <div class="flex justify-between">
          <LazyReviewStars :rating="rating" @update:rating="$emit('update:rating', $event)" :disabled="isCreatingReview" class="inline"></LazyReviewStars>
          <button v-if="isCollapsible" :disabled="isCreatingReview" @click="$emit('update:show', false)">關閉</button>
        </div>
        <div class="mt-2 w-full">
          <textarea :value="content" @input="$emit('update:content', $event.target.value)" :disabled="isCreatingReview" :placeholder="'在此輸入你的評論\n如出現濫發、粗言穢語、嘔心、或色情的内容，Shoperuse有權刪除有關評論。'" class="w-full border rounded-md p-2" rows="4"></textarea>

          <file-selector v-model="files"
                         v-slot="{ openDialog }"
                         :accept="['image/png', 'image/jpeg']"
                         :allowMultiple="false">
            <dropzone v-slot="{ hovered }">
              <div class="flex flex-col w-full rounded-lg border border-dashed border-gray-400 text-center text-gray-500">
                <div v-for="(preview, i) in previews" :key="preview" class="p-4">
                  <img :src="preview"/>
                  <!--                    {{ files[i].name }}-->
                </div>

                <x-button class="flex flex-col cursor-pointer p-4 m-4"
                          :class="{'rounded-lg border border-gray-400': previews.length !== 0}"
                          @click="openDialog">
                  <div class="text-lg">
                    +增加照片<span v-if="previews.length === 0">（選填）</span>
                  </div>
                  <div class="my-1 text-sm">
                    最多上載三張。
                  </div>
                </x-button>
              </div>


            </dropzone>
          </file-selector>

          <button :disabled="isCreatingReview" @click="$emit('create-review')" class="mt-2 btn btn-primary">{{ isCreatingReview ? "發送中" : "發送" }}</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>

import {imageUrlFromFile} from "~/utils/imageUrl"
import {PropType} from "vue"

const props = defineProps({
  show: {type: Boolean, default: true},
  isCollapsible: {type: Boolean, default: false},
  rating: {type: Number, default: 0},
  content: {type: String, default: ""},
  imageFiles: {type: Array as PropType<File[]>, default: []},
  isCreatingReview: {type: Boolean, default: false},
})
const {
  show,
  isCollapsible,
  rating,
  content,
  imageFiles,
  isCreatingReview,
} = toRefs(props)

const emit = defineEmits(["update:rating", "update:show", "update:content", "update:imageFiles", "create-review"])

const nuxt = useNuxtApp()

watch(isCreatingReview, (prev, current) => {
  if (prev && !current) {
    // Toast success.
    nuxt.$toast.success(`成功發送！`)
  }
})

// Image files.
const previews = ref([])
const files = computed({
  get: () => {
    return imageFiles.value
  },
  set: async val => {
    if (val.length > 3)
      val.splice(0, val.length - 3)
    emit("update:imageFiles", val)
    previews.value = await Promise.all(val.map(imageUrlFromFile))
  }
})

</script>

<script lang="ts">

import { FileSelector, Dropzone, DialogButton } from 'vue3-file-selector'

export default {
  components: {
    FileSelector,
    Dropzone,
    DialogButton
  }
}

</script>

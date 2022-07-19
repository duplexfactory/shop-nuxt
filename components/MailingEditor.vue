<template>
  <div class="p-6 bg-gray-100 rounded-md text-center">
    <div v-for="(mailing, i) in value"
         :key="mailing.title"
         :class="{'mt-2': i !== 0}"
         class="flex items-center bg-white rounded-md p-2">
      <div class="flex-1 text-left">
        <div class="inline-block border text-sm bg-white rounded-md py-1 px-2 mr-2">{{ mailingTypeToText[mailing.type] }}</div>
        <div class="inline-block">{{ mailing.title }}</div>
      </div>
      <div>
        <div class="inline-block mr-2">
          {{ formatMailingPrice(mailing) }}
        </div>
        <button @click="editingIndex = i" class="px-1"><i class="spr-edit"></i></button>
        <button @click="deleteMailing(i)" class="px-1"><i class="spr-cancel"></i></button>
      </div>
    </div>

    <div @click="editingIndex = -1" class="mt-2 p-6 rounded-md text-center border-dashed border-2 cursor-pointer">
      <div class="text-6xl text-gray-500">+</div>
      <template v-if="value.length === 0">
        <div class="text-lg">沒有郵寄方法</div>
        <div class="my-1 text-sm text-gray-500">
          請增加最少一種郵寄方法以繼續。
        </div>
      </template>
      <div v-else class="text-lg">新增郵寄方法</div>
    </div>

    <Teleport to="body">
      <transition name="modal">
        <LazyModal v-if="editingIndex !== null" @close="editingIndex = null">
          <template #container>
            <div class="w-full md:w-1/2">
              <MailingEditorItem :mailing="editingIndex === -1 ? null : value[editingIndex]"
                                 @save="saveMailing($event)"
                                 @cancel="editingIndex = null"></MailingEditorItem>
            </div>
          </template>
        </LazyModal>
      </transition>
    </Teleport>

    <Teleport to="body">
      <transition name="modal">
        <LazyConfirmModal v-if="showDeleteConfirmation"
                          cancelButtonTitle="取消"
                          confirmButtonTitle="確定"
                          @close="showDeleteConfirmation = false"
                          @confirm="confirmDelete">
          <template #body>
            <div class="p-4">
              <div>你是否確定刪除？</div>
            </div>
          </template>
        </LazyConfirmModal>
      </transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">

// Mailing
import {Ref} from "vue";
import {Mailing, MailingType} from "~/models/Order";
import {IgPageCommerceData} from "~/models/IgPageCommerceData";
import {mailingMethods, mailingTypeToText} from "~/data/commerce";

const props = defineProps<{
  modelValue: Mailing[],
  deleteConfirmation: { type: Boolean, default: false }
}>()
const emit = defineEmits(["update:modelValue", "save", "delete"])
const value = computed({
  get: () => props.modelValue,
  set: val => emit('update:modelValue', val)
})

const nuxt = useNuxtApp()

const editingIndex: Ref<number | null> = ref(null)

function formatMailingPrice(mailing: Mailing) {
  if (mailing.cost === 0) {
    return "免費"
  }
  if (!mailing.cost) {
    return "到付"
  }
  if (mailing.payOnArrive) {
    return `到付 HK$ ${mailing.cost}`
  }
  return `HK$ ${mailing.cost}`
}

function saveMailing(data) {
  if (editingIndex.value === -1) {
    value.value.push(data)
  }
  else {
    value.value[editingIndex.value] = data
  }
  editingIndex.value = null
  emit("save")
}

const showDeleteConfirmation = ref(false)
const deletingIndex = ref(null)
function deleteMailing(index: number) {
  deletingIndex.value = index
  if (props.deleteConfirmation) {
    showDeleteConfirmation.value = true
    return
  }
  confirmDelete()
}
function confirmDelete() {
  showDeleteConfirmation.value = false
  value.value.splice(deletingIndex.value, 1)
  emit("delete")
}

</script>

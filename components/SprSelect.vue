<template>
  <div class="relative flex items-center bg-white">
    <i class="spr-angle-down absolute right-0 pr-2"></i>
    <select class="select-primary w-full" v-model="value">
      <slot></slot>
    </select>
  </div>
</template>
<script setup lang="ts">
import {PropType} from "vue";
const props = defineProps<{modelValue: any}>()

const emit = defineEmits(["update:modelValue"])
const value = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})
</script>
<style scoped>

.select-primary {
  @apply rounded-md border py-2 pl-4 pr-8 appearance-none text-md bg-transparent z-1;
}

</style>

<template>
  <div class="relative flex items-center bg-white">
    <div class="absolute right-0 pr-2 z-2">
      <i v-if="clearable && value !== emptyValue" class="spr-cancel" @click="clickClear"></i>
      <i class="spr-angle-down"></i>
    </div>
    <select class="select-primary w-full"
            :class="{'clearable': clearable}"
            @change="emit('change')" v-model="value">
      <slot></slot>
    </select>
  </div>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {Discount} from "~/models/Discount";

// const props = defineProps({
//   modelValue: Object as PropType<any>,
//   emptyValue: Object as PropType<any>,
//   clearable: { type: Boolean, default: false },
// });

const props = withDefaults(defineProps<{
  modelValue: any,
  emptyValue: any,
  clearable: boolean,
}>(), {
  clearable: false
});

const {
  modelValue,
  emptyValue,
  clearable,
} = toRefs(props)

const emit = defineEmits(["update:modelValue", "change"])
const value = computed({
  get: () => modelValue.value,
  set: val => {
    emit('update:modelValue', val)
  }
})

function clickClear() {
  value.value = emptyValue.value
  emit('change')
}

</script>
<style scoped>

.select-primary {
  @apply rounded-md border py-2 pl-4 pr-8 appearance-none text-base bg-transparent z-1;
}

.select-primary.clearable {
  @apply pr-12 !important;
}

</style>

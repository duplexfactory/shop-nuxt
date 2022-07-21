<template>
  <div>
    <button @click="minusQuantity" class="text-input-prefix-primary !py-1">-</button>
    <input size="1"
           v-model.number="value"
           @change="quantityChanged"
           type="number"
           style="width: 40px;"
           class="text-center text-input-primary text-input-primary--prefixed text-input-primary--suffixed !py-1"/>
    <button @click="addQuantity" class="text-input-suffix-primary !py-1">+</button>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  modelValue: { type: Number, default: 1 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: -1 }
});

const value = computed({
  get: () => props.modelValue,
  set: val => {
    emit('update:modelValue', val)
  }
})

const emit = defineEmits(["update:modelValue", "change"])

function addQuantity() {
  if (value.value < props.max || props.max === -1)
    value.value ++
  emit('change')
}
function minusQuantity() {
  if (value.value > props.min)
    value.value--
  emit('change')
}
function quantityChanged() {
  if (!value.value || value.value < props.min)
    value.value = props.min
  if (value.value > props.max && props.max !== -1)
    value.value = props.max
  emit('change')
}

</script>

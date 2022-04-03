<template>
  <Toggle v-model="showAgeRestrictedContentBuffer"
          offLabel="全年齡"
          onLabel="18+"
          @change="showAgeRestrictedContentBufferChanged"
          :classes="{
            container: 'inline-block rounded-full outline-none focus:ring focus:ring-green-500 focus:ring-opacity-30',
            toggle: 'flex w-16 h-5 rounded-full relative cursor-pointer transition items-center box-content border-2 text-xs leading-none',
            toggleOn: 'bg-red-500 border-red-500 justify-start text-white',
            toggleOff: 'bg-gray-200 border-gray-200 justify-end text-gray-700',
            toggleOnDisabled: 'bg-gray-300 border-gray-300 justify-start text-gray-400 cursor-not-allowed',
            toggleOffDisabled: 'bg-gray-200 border-gray-200 justify-end text-gray-400 cursor-not-allowed',
            handle: 'inline-block bg-white w-5 h-5 top-0 rounded-full absolute transition-all',
            handleOn: 'left-full transform -translate-x-full',
            handleOff: 'left-0',
            handleOnDisabled: 'bg-gray-100 left-full transform -translate-x-full',
            handleOffDisabled: 'bg-gray-100 left-0',
            label: 'text-center w-12 border-box whitespace-nowrap select-none',
          }" />
</template>

<script setup lang="ts">

import {useShowAgeRestrictedContent, useShowAgeRestrictedModal} from "~/composables/states";

const showAgeRestrictedModal = useShowAgeRestrictedModal();
const showAgeRestrictedContent = useShowAgeRestrictedContent();
const showAgeRestrictedContentBuffer = ref(showAgeRestrictedContent.value);
function showAgeRestrictedContentBufferChanged() {
  if (showAgeRestrictedContentBuffer.value) {
    showAgeRestrictedModal.value = true;
  }
  else {
    showAgeRestrictedContent.value = false;
  }
}

watch(
    showAgeRestrictedModal,
    (show, prevShow) => {
      if (!show) {
        showAgeRestrictedContentBuffer.value = showAgeRestrictedContent.value;
      }
    }
)

</script>

<script lang="ts">
import Toggle from "@vueform/toggle";

export default  {
  components: {
    Toggle,
  },
}
</script>
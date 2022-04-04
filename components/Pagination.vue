<template>
  <div class="text-sm">
    <div class="hidden sm:block">
      <button v-for="(_, i) in Array(Math.min(Math.ceil(records / perPage) , 10)).fill(0)"
              :key="'paginate-' + i"
              class="px-1"
              :class="currentPage === i + offset  ? 'underline text-pink-400' : 'text-gray-500'"
              @click="pageClicked(i + offset)">{{ i + offset }}</button>
    </div>
    <div class="flex justify-between items-center sm:hidden">
      <button class="text-sm flex-1" :class="{'invisible': currentPage === 1}" @click="pageClicked(currentPage - 1)">上一頁</button>

      <div class="flex flex-1 justify-center mx-2">
        <select :value="currentPage" @change="pageClicked(Number($event.target.value))">
          <option v-for="(_, i) in Array(Math.ceil(records / perPage)).fill(0)"
                  :key="'paginate-option-' + i"
                  :value="i + 1">{{ `第 ${i + 1} 頁` }}</option>
        </select>
      </div>

      <button class="text-sm flex-1" :class="{'invisible': currentPage === Math.ceil(records / perPage)}" @click="pageClicked(currentPage + 1)">下一頁</button>

    </div>
  </div>
</template>

<script lang="ts">
import {PropType} from "vue";
export default {
  name: "Pagination",
  props: {
    currentPage: {type: Number, default: 1},
    records: Number as PropType<Number>,
    perPage: {type: Number, default: 10},
  },
  computed: {
    offset() {
      return 1 + Math.min(Math.max(this.currentPage - 6, 0), Math.max(Math.ceil(this.records / this.perPage) - 10, 0));
    }
  },
  methods: {
    pageClicked(i: number) {
      if (i !== this.currentPage) {
        this.$emit("update:currentPage", i);
        this.$emit("pageChanged");
      }
    }
  },
  watch: {
    // records: function (current, prev) {
    //   this.$emit("update:currentPage", 1);
    // },
    // perPage: function (current, prev) {
    //   this.$emit("update:currentPage", 1);
    // }
  }
}
</script>

<style scoped>

</style>
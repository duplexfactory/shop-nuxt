<template>
  <LazyModal @close="closeModal">
    <template v-slot:header>
      <div class="flex">
        <button style="aspect-ratio: 1;" @click="closeModal">
          <i class="sio-angle-left text-2xl"></i>
        </button>
        <input @keyup.enter="search"
               v-model="searchText"
               class="search-input"
               placeholder="搜尋 商店 或 貼文"
               type="search"
               autocomplete="off"/>
        <button @click="search" class="bg-pink-400 text-white px-2">
          <i class="sio-search text-xl"></i>
        </button>
      </div>
    </template>

    <template v-slot:body>
      <div>
        <template v-if="tagsSearchResult.length !== 0">
          <div class="px-4 py-2 text-sm bg-gray-50">分類</div>
          <div class="px-4 pb-2">
            <div class="line-clamp-2" style="font-size: 0px;">
              <!-- Use mousedown to take precedence over focusout -->
              <button @click="tagPressed(tag.id)" v-for="tag in tagsSearchResult" :key="tag.id" class="tag mt-2 mr-4">{{ `#${tag.label}` }}</button>
            </div>
          </div>
        </template>

        <template v-if="searchResults.length !== 0">
          <div class="px-4 py-2 text-sm bg-gray-50">搜尋結果</div>
          <button @click="quickSearchResultPressed(result.username)" class="px-4 py-2 text-sm block w-full text-left" v-for="result in searchResults">{{ result.username }}</button>
        </template>
      </div>
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

const props = defineProps({
  showModal: { type: Boolean, default: false },
});

const searchText = ref<string>("");

const {ageRestrictedCategories} = useTags();
const tagsSearchResult = ref<{id: string, label: string}[]>([]);

tagsSearchResult.value = ageRestrictedCategories.value.map((c) => c.tags).flat();

import useSearch from "~/composables/useSearch";
const {
  searchResults,
  searchResultTotalCount,
  search: quickSearch
} = useSearch();

</script>
<script lang="ts">

import {PageSearchQuery} from "~/models/PageSearchQuery";
import {PaginationQuery} from "~/models/PaginationQuery";

export default  {
  methods: {
    closeModal: function() {
      this.$emit('update:showModal', false)
    },
    tagPressed: function(tagId: string) {
      let query = this.$route.path == "/search" ? {...this.$route.query} : {};
      Object.assign(query, { tag: tagId });
      this.$router.push({path: '/search', query});

      this.closeModal();
    },
    quickSearchResultPressed: function(username: string) {
      this.$router.push({path: `/shop/${username}`});

      this.closeModal();
    },
    search: function () {
      let query = this.$route.path == "/search" ? {...this.$route.query} : {};
      if (this.searchText != "") {
        query["keyword"] = this.searchText;
      }
      else {
        delete query["keyword"];
      }

      this.$router.push({
        path: "/search",
        query
      });

      this.closeModal();
    }
  },
  watch: {
    searchText: async function (searchText) {
      this.tagsSearchResult = [];
      if (searchText === '') {
        this.tagsSearchResult = this.ageRestrictedCategories.map((c) => c.tags).flat();
        this.searchResults = [];
        return;
      }

      for (const c of this.ageRestrictedCategories as {id: string, label: string, tags: {id: string, label: string}[]}[]) {
        this.tagsSearchResult.push(...c.tags.filter((t) => c.id.includes(searchText) || c.label.includes(searchText) || t.id.includes(searchText) || t.label.includes(searchText)));
      }

      await this.quickSearch(new PageSearchQuery(
          searchText,
      ), new PaginationQuery(0, 20));
    },
  }
}

</script>


<style scoped>

.search-input {
  @apply border py-2 px-4 text-md flex-1;
}


</style>

<template>
  <LazyModal v-if="props.showModal" @close="closeModal">
    <template v-slot:header>
      <div class="flex">
        <button @click="closeModal">back</button>
        <input @keyup.enter="search"
               v-model="searchText"
               class="search-input"
               placeholder="搜尋 商店 或 貼文"
               type="search"
               autocomplete="off"/>
        <button @click="search" class="border border-pink-400 btn-primary !rounded-none">搜尋</button>
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
          <button @click="quickSearchResultPressed(result._id)" class="px-4 py-2 text-sm block" v-for="result in searchResults">{{ result.username }}</button>
        </template>
      </div>
    </template>
  </LazyModal>
</template>

<script setup lang="ts">

import useSearch from "~/composables/useSearch";

const props = defineProps({
  showModal: { type: Boolean, default: false },
});

const searchText = ref<string>("");

const {categories} = useTags();
const {
  searchResults,
  searchResultTotalCount,
  search: quickSearch
} = useSearch();

</script>
<script lang="ts">

import {PageSearchQuery} from "~/models/PageSearchQuery";

export default  {
  data(): {
    searchText: string,
    categoriesSearchResult: {id: string, label: string, tags: {id: string, label: string}[]}[],
    tagsSearchResult: {id: string, label: string}[],
  } {
    return {
      searchText: '',
      categoriesSearchResult: [],
      tagsSearchResult: [],
    }
  },
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
    quickSearchResultPressed: function(pagePk: number) {
      this.$router.push({path: `/shop/${pagePk}`});

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
    }
  },
  watch: {
    searchText: async function (searchText) {
      this.categoriesSearchResult = [];
      this.tagsSearchResult = [];
      if (searchText === '') {
        return;
      }

      for (const c of this.categories as {id: string, label: string, tags: {id: string, label: string}[]}[]) {
        if (c.id.includes(searchText) || c.label.includes(searchText)) {
          this.categoriesSearchResult.push(c);
        }
        this.tagsSearchResult.push(...c.tags.filter((t) => c.id.includes(searchText) || c.label.includes(searchText) || t.id.includes(searchText) || t.label.includes(searchText)));
      }

      await this.quickSearch(new PageSearchQuery(
          searchText,
      ));
    },
  }
}

</script>


<style scoped>

.search-input {
  @apply border py-2 px-4 text-md flex-1;
}


</style>

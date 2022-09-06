<template>
  <LazyModal @close="closeModal">
    <template v-slot:header>
      <div class="flex">
        <button @click="closeModal">
          <i class="spr-angle-left text-2xl px-3"></i>
        </button>
        <input @keyup.enter="search"
               v-model="searchText"
               class="search-input"
               placeholder="搜尋 商店 或 貼文"
               type="search"
               autocomplete="off"/>
        <button @click="search" class="bg-pink-400 text-white">
          <i class="spr-search text-2xl px-3"></i>
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

import {PageSearchQuery} from "~/models/PageSearchQuery";

const route = useRoute()
const router = useRouter()

const props = defineProps({
  showModal: { type: Boolean, default: false },
});

const emit = defineEmits(["update:showModal"])

const searchText = ref<string>("");

const {ageRestrictedCategories} = useTags();
const tagsSearchResult = ref<{id: string, label: string}[]>([]);
tagsSearchResult.value = ageRestrictedCategories.value.map((c) => c.tags).flat();

import useSearch from "~/composables/useSearch";
import {PaginationQuery} from "~/models/PaginationQuery";
const {
  searchResults,
  searchResultTotalCount,
  search: quickSearch
} = useSearch();

function closeModal() {
  emit('update:showModal', false)
}

function tagPressed(tagId: string) {
  let query = route.path == "/search" ? {...route.query} : {}
  Object.assign(query, { tag: tagId })
  router.push({path: '/search', query})

  closeModal()
}

function quickSearchResultPressed(username: string) {
  router.push({path: `/shop/${username}`})
  closeModal()
}

function search() {
  let query = route.path == "/search" ? {...route.query} : {};
  if (searchText.value != "") {
    query["keyword"] = searchText.value;
  }
  else {
    delete query["keyword"];
  }

  router.push({
    path: "/search",
    query
  });

  closeModal();
}

watch(searchText, async () => {

  tagsSearchResult.value = [];
  if (searchText.value === '') {
    tagsSearchResult.value = ageRestrictedCategories.value.map((c) => c.tags).flat();
    return;
  }

  for (const c of ageRestrictedCategories.value as {id: string, label: string, tags: {id: string, label: string}[]}[]) {
    tagsSearchResult.value.push(...c.tags.filter((t) => c.id.includes(searchText.value) || c.label.includes(searchText.value) || t.id.includes(searchText.value) || t.label.includes(searchText.value)));
  }

  await quickSearch(new PageSearchQuery(
      searchText.value,
  ), new PaginationQuery(0, 20));

})

</script>

<style scoped>

.search-input {
  @apply border py-2 px-4 text-base flex-1;
}


</style>

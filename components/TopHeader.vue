<template>
  <div>
    <div class="md:container mx-auto px-4 py-2 border-b-1 md:(py-5 border-none) flex items-center justify-between">
      <!-- left -->
      <div class="flex items-center flex-1 md:mr-8">

        <button class="md:hidden" @click="$emit('toggleDrawer')">
          <i class="spr-menu text-2xl"></i>
        </button>

        <nuxt-link to="/" class="md:mr-4"><img style="width: 100px; height: 50px;" src="/images/logo.png"/></nuxt-link>

        <!-- Mobile Search Button -->
        <button @click="showSearchModal = true" class="sm:hidden border rounded-md py-2 px-4 text-sm text-gray-400 flex-1 mr-2">
          搜尋商店<i class="spr-search ml-4"></i>
        </button>
        <!-- Desktop Search Input -->
        <div class="hidden sm:block flex-1">
          <div class="flex w-full">
            <div class="dropdown flex-1" style="max-width: 350px;">
              <input @keyup.enter="search" @focusin="searchInputFocusIn" @focusout="searchInputFocusOut"
                     v-model="searchText" class="search-input" placeholder="搜尋 商店 或 貼文" type="search" autocomplete="false"
                     id="search" name="search"/>
              <div v-if="showSearchDropdown && searchText !== ''" class="search-menu">
                <template v-if="tagsSearchResult.length !== 0">
                  <div class="px-4 py-2 text-sm bg-gray-50">分類</div>
                  <div class="px-4 pb-2">
                    <div class="line-clamp-2" style="font-size: 0px;">
                      <!-- Use mousedown to take precedence over focusout -->
                      <button @mousedown="tagPressed(tag.id)" v-for="tag in tagsSearchResult" :key="tag.id"
                              class="tag mt-2 mr-4">{{ `#${tag.label}` }}
                      </button>
                    </div>
                  </div>
                </template>
                <template v-if="searchResults.length !== 0">
                  <div class="px-4 py-2 text-sm bg-gray-50">搜尋結果</div>
                  <button @mousedown="quickSearchResultPressed(result.username)" class="px-4 py-2 text-sm block"
                          v-for="result in searchResults.slice(0, 10)">{{ result.username }}
                  </button>
                </template>
              </div>
            </div>
            <button @click="search" class="border border-pink-400 btn-primary !rounded-none">搜尋</button>
          </div>
          <!--          <ul v-if="showSearchDropdown" class="search-menu">-->
          <!--            <li v-for="category in categoriesSearchResult" :key="category.id" class="px-4 py-1">{{ category.label }}</li>-->
          <!--            <li v-for="tag in tagsSearchResult" :key="tag.id" class="px-4 py-1">{{ tag.label }}</li>-->
          <!--          </ul>-->

        </div>

      </div>

      <!-- right -->
      <div class="">

        <nuxt-link v-if="!isLoggedIn" to="/verify" class="hidden md:inline-block btn btn-sm btn-primary mr-4">認證我的商店</nuxt-link>
        <nuxt-link v-if="!isLoggedIn" to="/login/shop" class="md:(btn btn-sm btn-outline mr-4) text-pink-600 text-sm">商戶登入</nuxt-link>

        <div class="hidden md:inline-block">
          <Popper v-if="isLoggedIn" hover offsetDistance="0" placement="top">
            <button class="text-sm text-gray-500">
              settings
            </button>
            <template #content>
              <div class="text-sm p-2 bg-white rounded-md shadow-md">
                <div class="p-2">
                  <nuxt-link to="/my/account" class="">我的帳戶</nuxt-link>
                </div>
                <div v-if="isIgConnected" class="p-2">
                  <nuxt-link to="/my/shop" class="">我的商店</nuxt-link>
                </div>
                <div class="p-2">
                  <AgeRestrictionToggle/>
                </div>
                <div class="p-2">
                  <button @click="logout" class="">登出</button>
                </div>
              </div>
            </template>
          </Popper>
        </div>


      </div>

    </div>

  </div>

</template>

<script setup lang="ts">

  import Popper from "vue3-popper";
  import useSearch from "~/composables/useSearch"
  import {useShowSearchModal} from "~/composables/states"

  const {ageRestrictedCategories} = useTags()
  const {
    searchResults,
    searchResultTotalCount,
    search: quickSearch
  } = useSearch()

  const showSearchModal = useShowSearchModal()

  // Login
  const isLoggedIn = useIsLoggedIn();
  const isIgConnected = useIsIgConnected();
  const {
    logout
  } = useLogout();

</script>

<script lang="ts">

  import {PageSearchQuery} from "~/models/PageSearchQuery"
  import {PaginationQuery} from "~/models/PaginationQuery"

  export default {
    data(): {
      showSearchDropdown: boolean,
      searchText: string,
      categoriesSearchResult: { id: string, label: string, tags: { id: string, label: string }[] }[],
      tagsSearchResult: { id: string, label: string }[],
    } {
      return {
        showSearchDropdown: false,
        searchText: "",
        categoriesSearchResult: [],
        tagsSearchResult: [],
      }
    },
    methods: {
      searchInputFocusIn: function () {
        this.showSearchDropdown = true
      },
      searchInputFocusOut: function () {
        this.showSearchDropdown = false
      },
      tagPressed: function (tagId: string) {
        let query = this.$route.path == "/search" ? {...this.$route.query} : {}
        Object.assign(query, {tag: tagId})
        this.$router.push({path: "/search", query})
      },
      quickSearchResultPressed: function (username: string) {
        this.$router.push({path: `/shop/${username}`})
      },
      search: function () {
        let query = this.$route.path == "/search" ? {...this.$route.query} : {}
        if (this.searchText != "") {
          query["keyword"] = this.searchText
        } else {
          delete query["keyword"]
        }
        delete query["page"]

        this.$router.push({
          path: "/search",
          query
        })
      }
    },
    watch: {
      searchText: async function (searchText) {
        this.categoriesSearchResult = []
        this.tagsSearchResult = []
        if (searchText === "") {
          return
        }

        for (const c of this.ageRestrictedCategories as { id: string, label: string, tags: { id: string, label: string }[] }[]) {
          if (c.id.includes(searchText) || c.label.includes(searchText)) {
            this.categoriesSearchResult.push(c)
          }
          this.tagsSearchResult.push(...c.tags.filter((t) => c.id.includes(searchText) || c.label.includes(searchText) || t.id.includes(searchText) || t.label.includes(searchText)))
        }

        await this.quickSearch(new PageSearchQuery(
          searchText,
        ), new PaginationQuery(0, 11))
      },
    }
  }

</script>

<style scoped>

  .search-input {
    @apply border py-2 px-4 text-md w-full;
  }

  .dropdown {
    @apply relative;
  }

  .dropdown .search-menu {
    z-index: 1000;
    @apply absolute bg-white w-full shadow-lg;
  }

  .dropdown .search-menu li {
    @apply px-8 py-2 text-center;
  }

  [class^="spr-"]:before, [class*=" spr-"]:before {
    margin: 0px !important;
  }


</style>
